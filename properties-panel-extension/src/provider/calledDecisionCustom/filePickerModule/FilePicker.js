import { html } from "htm/preact";
import { useState } from "camunda-modeler-plugin-helpers/vendor/@bpmn-io/properties-panel/preact/hooks";
import Dialog from "./Dialog";
import { React } from "camunda-modeler-plugin-helpers/react";
import SelectedRuleOuterViewPanel from "./SelectedRuleOuterViewPanel";
import { fileToObject } from "./Utils/utils";
import { Icon, Tooltip } from "preact-material-components";
const processFiles = (files) => {
  const directoryTree = {};

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.name.endsWith(".dmn")) {
      const pathParts = file.webkitRelativePath.split("/");
      let currentLevel = directoryTree;

      for (let j = 0; j < pathParts.length - 1; j++) {
        const folderName = pathParts[j];
        if (!currentLevel[folderName]) {
          currentLevel[folderName] = {};
        }
        currentLevel = currentLevel[folderName];
      }

      const fileName = pathParts[pathParts.length - 1];
      if (!currentLevel[fileName]) {
        currentLevel[fileName] = [];
      }
      currentLevel[fileName].push(fileToObject(file));
    }
  }

  return directoryTree;
};

const FilePicker = (props) => {
  //localStorage.clear()
  console.log("hi");
  console.log(localStorage.getItem("ruleDirectory"));
  const { getValue, setValue, element } = props;
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [directory, setDirectory] = useState(
    JSON.parse(localStorage.getItem("ruleDirectory"))
  );

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      const directoryTree = processFiles(files);
      setDirectory(directoryTree);
      //console.log(directoryTree)
      localStorage.setItem("ruleDirectory", JSON.stringify(directoryTree));
      console.log(directoryTree);
    }
  };

  const openDialog = () => setDialogOpen(true);
  const openFileInput = () => {
    const fileInput = document.getElementById("ruleDirRefresh");
    fileInput.click();
  };
  const closeDialog = () => {
    setDialogOpen(false);
  };

  // move to .css file
  const containerStyle = {
    padding: "5px",
    display: "flex",
    flexDirection: "column", // Ensure items are stacked vertically
    justifyContent: "center", // Horizontally center
    alignItems: "center", // Vertically center
  };

  // This is the condition to control whether to render the content or not
  const shouldRenderContent = false; // Change this condition as needed

  return html`
    <div>
      ${directory !== null
        ? html`
            <div style=${containerStyle}>
              <div
                style="display: inline-flex; align-items: center; gap: 10px;"
              >
                <button class="buttonRulePick" onClick=${openDialog}>
                  Open Rule Picker
                </button>
                <input
                  id="ruleDirRefresh"
                  style="display: none;"
                  type="file"
                  onChange=${handleFileChange}
                  directory
                  webkitdirectory
                  value=${global.centralDataBus["ruleProjectBasePath"]}
                />
                <${Tooltip} title="Refresh to load new directory">
                <${Icon} style="padding: 0px 5px; cursor: pointer;" onclick=${openFileInput}> 🔄 </${Icon}>
                </${Tooltip}>
              </div>

              <${Dialog}
                isOpen=${isDialogOpen}
                onClose=${closeDialog}
                getValue=${getValue}
                setValue=${setValue}
                element=${element}
                directoryTree=${directory}
              />
            </div>
            <div>
              <${SelectedRuleOuterViewPanel}
                getValue=${getValue}
                element=${element}
                dialogState=${isDialogOpen}
                directoryTree=${directory}
              />
            </div>
          `
        : html`
            <div>
              <input
                type="file"
                onChange=${handleFileChange}
                directory
                webkitdirectory
                value=${global.centralDataBus["ruleProjectBasePath"]}
              />
              Load the rule directory here !!
            </div>
          `}
    </div>
  `;
};

export default FilePicker;
