import { h } from "preact";
import { html } from "htm/preact";
import {
  useState,
  useEffect,
} from "camunda-modeler-plugin-helpers/vendor/@bpmn-io/properties-panel/preact/hooks";
import "./dialog.css";

import Icon from "preact-material-components/Icon";

import {
  decorateResponse,
  convertSelectedFilesToTree,
  toggleFolder,
  getNestedProperty,
  removeNestedKey,
  addNestedObject,
  moveFolder,
  hasNestedArray,
  fileTreeToFileObjectsArray,
  formTreeFromSelectedFiles,
  getFileObjectToInsert,
  getFolderObjectToInsert,
} from "./Utils/utils";

function mergeAtPath(originalObj, path, objToMerge) {
  /**
   * Merges objToMerge into originalObj at the specified path.
   *
   * @param originalObj: The original JSON object.
   * @param path: An array of keys representing the path where the merge should occur.
   * @param objToMerge: The JSON object to merge at the specified path.
   */

  function mergeDeep(target, source) {
    // Merge two objects, handling nested objects
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (source[key] instanceof Object && target[key] instanceof Object) {
          mergeDeep(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      }
    }
  }

  // Navigate to the desired path
  let current = originalObj;
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    if (!current[key]) {
      current[key] = {}; // Create an empty object if the path does not exist
    }
    current = current[key];
  }

  // Merge the object at the final key in the path
  const lastKey = path[path.length - 1];
  if (!current[lastKey]) {
    current[lastKey] = objToMerge; // Directly assign if the key doesn't exist
  } else if (
    typeof current[lastKey] === "object" &&
    typeof objToMerge === "object"
  ) {
    mergeDeep(current[lastKey], objToMerge); // Merge if both are objects
  } else {
    current[lastKey] = objToMerge; // Replace if not objects
  }
}

const Dialog = ({
  isOpen,
  onClose,
  getValue,
  setValue,
  element,
  directoryTree,
}) => {
  useEffect(() => {
    // Update the state variable whenever the return value of getValue changes
    const newValue = getValue();
    setSelectedFiles(decorateResponse(newValue, directoryTree));
  }, [element]);

  const [fileTree, setFileTree] = useState(directoryTree);

  const [selectedFilesPrevState, setSelectedFilesPrevState] = useState(
    decorateResponse(getValue(), directoryTree)
  );
  const [selectedFiles, setSelectedFiles] = useState(
    decorateResponse(getValue(), directoryTree)
  );

  const [rightPanelSelectedItem, setRightPanelSelectedItem] = useState([]);

  const shiftUp = () => {
    const selectedFilesCopy = [...selectedFiles];
    for (let i = 1; i < selectedFilesCopy.length; i++) { // Start from index 1 to allow for shifting
      const currentItem = selectedFilesCopy[i];
      
      if (rightPanelSelectedItem.includes(currentItem['key'])) {
        // Swap with the previous item
        [selectedFilesCopy[i - 1], selectedFilesCopy[i]] = [selectedFilesCopy[i], selectedFilesCopy[i - 1]];
      }
    }
  
    setSelectedFiles(selectedFilesCopy)
  };

  const shiftDown = () => {
    const selectedFilesCopy = [...selectedFiles];
    for (let i = 0; i < selectedFilesCopy.length-1; i++) { // Start from index 1 to allow for shifting
      const currentItem = selectedFilesCopy[i];
      
      if (rightPanelSelectedItem.includes(currentItem['key'])) {
        // Swap with the previous item
        [selectedFilesCopy[i +1 ], selectedFilesCopy[i]] = [selectedFilesCopy[i], selectedFilesCopy[i + 1]];
      }
    }
  
    setSelectedFiles(selectedFilesCopy)
  };

  const onCloseLocal = () => {
    //setFileTree(setFileTreePrevState);
    setSelectedFiles(selectedFilesPrevState);
    onClose();
  };

  const modifyRightPanelSelectedItem = (value, type) => {
    console.log("hi");
    if (rightPanelSelectedItem.includes(value)) {
      setRightPanelSelectedItem(
        rightPanelSelectedItem.filter((item) => item !== value)
      );
    } else {
      setRightPanelSelectedItem([...rightPanelSelectedItem, ...[value]]);
    }
    console.log(rightPanelSelectedItem);
  };

  const onSave = () => {
    setSelectedFilesPrevState(selectedFiles);
    let resultArray = [];

    selectedFiles.forEach((obj) => {
      // Check if the obj type is 'file'
      if (obj["type"] === "file") {
        // If type is 'file', push webkitRelativePath
        resultArray.push(`"${obj["webkitRelativePath"]}"`);
      } else {
        // If type is not 'file', push folderPath
        resultArray.push(`"${obj["folderPath"]}"`);
      }
    });

    // Set the value to a JSON array representation of resultArray
    setValue(`[${resultArray.join(", ")}]`);
    // Close the modal or perform any onClose operation
    onClose();
  };

  const [selectedFilesTree, setSelectedFilesTree] = useState(
    formTreeFromSelectedFiles(
      decorateResponse(getValue(), directoryTree),
      directoryTree
    )
  );

  useEffect(() => {
    setSelectedFilesTree(
      formTreeFromSelectedFiles(selectedFiles, directoryTree)
    );
  }, [selectedFiles]);



 

  function fileSelected(obj) {
    for (const selectedFile of selectedFiles) {
      if (
        selectedFile["type"] === "file" &&
        selectedFile["webkitRelativePath"].includes(obj["webkitRelativePath"])
      ) {
        return true;
      }
    }
    return false;
  }

  function folderSelected(folderPath) {
    for (const selectedFile of selectedFiles) {
      if (
        selectedFile["type"] === "folder" &&
        selectedFile["folderPath"] === folderPath
      ) {
        //console.log("problem here");
        return true;
      }
    }
    return false;
  }

  if (!isOpen) return null;

  const renderFileTree = (
    tree,
    renderingSelectedFiles,
    currentPath = "",
    selectedTreePath = ""
  ) => {
    //console.log(renderingSelectedFiles,tree)
    // Sort tree entries by name
    const sortedTreeEntries = Object.entries(tree).sort(([nameA], [nameB]) =>
      nameA.localeCompare(nameB)
    );

    return sortedTreeEntries.map(([name, value]) => {
      // Skip empty objects
      if (!Array.isArray(value) && Object.keys(value).length === 0) {
        return null;
      }

      if (Array.isArray(value)) {
        // For files, render them
        const fileType = value.at(0)["name"].split(".").at(-1);

        // Check if any file in the array satisfies the condition
        const shouldRender = value.some(
          (file) =>
            (renderingSelectedFiles === false &&
              fileSelected(file) === false) ||
            renderingSelectedFiles === true
        );

        // Return the li element only if the condition is true
        return shouldRender
          ? html` <li
              class="file ${fileType}"
              onClick=${() =>
                handleFileSelection(value, renderingSelectedFiles)}
              style="
              cursor: pointer;
              background-color: ${rightPanelSelectedItem.includes(
                selectedTreePath
              )
                ? "#b3d9ff"
                : "inherit"};
              transition: background-color 0.3s;"
            >
              ${value.map((file) => {
                // Check the condition here
                if (
                  (renderingSelectedFiles === false &&
                    fileSelected(file) === false) ||
                  renderingSelectedFiles === true
                ) {
                  return html`
                    <div>
                      <span>${file.name}</span>
                      ${renderingSelectedFiles === true &&
                      selectedTreePath !== "child" &&
                      html`<${Icon} style="padding: 0px 5px; cursor: pointer; color: red;" onclick=${() =>
                        handleFileRemoval(file)}> X </${Icon}>
                        <${Icon} style="padding: 0px 5px; cursor: pointer; color: black;" onclick=${() =>
                        modifyRightPanelSelectedItem(
                          selectedTreePath,
                          "file"
                        )}> ↑↓ </${Icon}>`}
                    </div>
                  `;
                } else {
                  return null;
                }
              })}
            </li>`
          : null;
      } else {
        // Construct the full path for the folder
        const fullPath = currentPath ? `${currentPath}/${name}` : name;

        if (folderSelected(fullPath) === true) {
          return null;
        }

        return html`
          <li
            class="folder"
            data-path="${fullPath}"
            style="
              cursor: pointer;
              background-color: ${rightPanelSelectedItem.includes(
              selectedTreePath
            )
              ? "#b3d9ff"
              : "inherit"};
              transition: background-color 0.3s;"
          >
            <input
              type="checkbox"
              id=${name + (renderingSelectedFiles === true ? "x" : "")}
            />
            <label
              for=${name + (renderingSelectedFiles === true ? "x" : "")}
              onClick=${toggleFolder}
            >
              ${name}
              <span style="margin-left: 5px;"></span>
              <button
                style="font-size: 12px; padding: 2px 4px; cursor: pointer; border: none; background: none;"
                onclick=${(event) => {
                  event.stopPropagation();
                  handleFolderRemoval(
                    name,
                    value,
                    fullPath,
                    selectedTreePath,
                    renderingSelectedFiles
                  );
                }}
              >
                ${renderingSelectedFiles === false
                  ? "▶▶"
                  : selectedTreePath !== "child"
                  ? "◀◀"
                  : null}
              </button>
              <span style="margin-left: 5px;"></span>
              <button
                style="font-size: 12px; padding: 2px 4px; cursor: pointer; border: none; background: none;"
                onclick=${(event) => {
                  event.stopPropagation();
                  modifyRightPanelSelectedItem(selectedTreePath, "folder");
                }}
              >
                ${renderingSelectedFiles === true &&
                selectedTreePath !== "child"
                  ? "↑↓"
                  : null}
              </button>
            </label>
            <ul style="display:none;">
              ${renderFileTree(
                value,
                renderingSelectedFiles,
                fullPath,
                "child"
              )}
            </ul>
          </li>
        `;
      }
    });
  };

  const handleFileSelection = (files, renderingSelectedFiles) => {
    //console.log("Before File Selection ", fileTree, selectedFiles);
    if (renderingSelectedFiles === true) {
      return;
    }

    const path = files.at(-1)["webkitRelativePath"];
    const fileObjToInsert = getFileObjectToInsert(directoryTree, path);

    let copyFileTree = { ...fileTree };
    const pathParts = files.at(-1)["webkitRelativePath"].split("/");

    //removeNestedKey(copyFileTree, pathParts.slice(0, -1), pathParts.at(-1));

    //setFileTree(copyFileTree);

    setSelectedFiles([...selectedFiles, ...[fileObjToInsert]]);
    console.log("After File Selection ", fileTree, selectedFiles);
  };

  const handleFolderRemoval = (
    name,
    value,
    fullPath,
    selectedTreePath,
    renderingSelectedFiles
  ) => {
    if (renderingSelectedFiles === false) {
      setSelectedFiles([...selectedFiles, ...[getFolderObjectToInsert(fullPath)]]);
      //console.log(folderObjectToInsert);
    } else {
      console.log(name, value, fullPath, renderingSelectedFiles);
      const updatedSelectedFiles = selectedFiles.filter(
        (obj) =>
          obj["type"] === "file" || obj["folderPath"] !== selectedTreePath
      );
      setSelectedFiles(updatedSelectedFiles);
    }
  };

  const handleFileRemoval = (fileToRemove) => {
    const updatedSelectedFiles = selectedFiles.filter(
      (file) => file !== fileToRemove
    );
    setSelectedFiles(updatedSelectedFiles);
  };

  return html`
    <div>
      <div class="dialog-overlay">
        <div class="dialog-content" onClick=${(e) => e.stopPropagation()}>
          <h2>Rule Picker</h2>
          <div class="dialog-panels">
            <div class="panel left-panel">
              <h3>Rule Project Directory</h3>
              ${fileTree &&
              html`<ul class="file-tree">
                ${renderFileTree(fileTree, false)}
              </ul>`}
            </div>
            <div class="panel-control"></div>
            <div class="panel right-panel">
              <h3>Selected Rules</h3>
              ${selectedFilesTree &&
              html`
                <ul class="file-tree">
                  ${Object.entries(selectedFilesTree)
                    // Sort entries based on rank
                    .sort(([, a], [, b]) => a.rank - b.rank)
                    // Map over sorted entries and render each tree
                    .map(
                      ([key, tree]) =>
                        html`
                          ${renderFileTree(
                            { [key]: tree["value"] },
                            true,
                            "",
                            tree["path"]
                          )}
                        `
                    )}
                </ul>
              `}
            </div>
          </div>
          <div style="padding: 10px; display: inline-block;">
            <button
              class="dialog-buttons"
              style="margin-right: 10px;"
              onClick=${onCloseLocal}
            >
              Close
            </button>

            <button
              class="dialog-buttons"
              style="display: inline-block;"
              onClick=${onSave}
            >
              Save
            </button>
          </div>

          <div
            style="padding: 10px; display: inline-flex; justify-content: flex-end; float: right;"
          >
            <button
              class="dialog-buttons"
              style="margin-right: 10px;"
              onClick=${shiftUp}
            >
              ▲
            </button>

            <button
              class="dialog-buttons"
              style="display: inline-block;"
              onClick=${shiftDown}
            >
              ▼
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
};

export default Dialog;
