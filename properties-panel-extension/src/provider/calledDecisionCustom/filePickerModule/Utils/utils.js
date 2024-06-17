// utils.js

// Utility function to calculate the sum of two numbers

import { html } from "htm/preact";
import { get } from "min-dash";
import { h } from "preact";
const _ = require('lodash');

export function fileToObject(file) {
  return {
    name: file['name'],
    size: file['size'],
    fileType: file['type'],
    webkitRelativePath: file['webkitRelativePath'],
    key: file['webkitRelativePath']
    
  };
}

export function getFileObjectToInsert(directoryTree, path) {
  console.log(directoryTree)
    let fileObj = getNestedProperty(directoryTree, path.split("/")).at(0)
    fileObj['type'] = "file"
    return fileObj
}

export function getFolderObjectToInsert(path) {
  return {
    type : "folder",
    folderPath: path,
    folderName: path.split("/").at(-1),
    key : path
  };
}

export function decorateResponse(response, directoryTree) {

  const decoratedFileArr = [];
  const stringToArray = JSON.parse(response["decisionId"]);

  if (stringToArray && stringToArray.length) {
    stringToArray.forEach((path, index) => {
  
      const lastPartofPath = path.split("/").at(-1);
      const fileOrFolder = lastPartofPath.includes(".") ? "file" : "folder"
      if(fileOrFolder==="file"){
        decoratedFileArr.push(getFileObjectToInsert(directoryTree, path))
      }
      else{
        decoratedFileArr.push(getFolderObjectToInsert(path));
      }
    });
  }
  
  /*decoratedFileArr.push({
    type : "folder",
    folderPath: "RuleProject/DetermineAuthorizerBusinessRules",
    folderName: "DetermineAuthorizerBusinessRules"
  })*/
  
  return decoratedFileArr;
}
// Utility function to calculate the product of two numbers
export function convertSelectedFilesToTree(files) {
  let tree = {};
  let currentObj = {};

  for (const file of files) {
    currentObj = tree;
    const pathParts = file["webkitRelativePath"].split("/");



    for (const part of pathParts) {
  
      if (part === file["name"]) {
        currentObj[part] = [file];
        break;
      }
      if (part in currentObj) {
        //no nohting
      } else {
        currentObj[part] = {};
      }
      currentObj = currentObj[part];
    }
  }


  return tree;
}

export const moveFolder = (
  name,
  fileTree,
  renderingSelectedFiles,
  selectedFiles
) => {
  const fileTreeCopy = _.cloneDeep(fileTree);
  const selectedFilesCopy = _.cloneDeep(selectedFiles);

  console.log("Before Folder Move ", fileTreeCopy, selectedFilesCopy)
  return
  

  if (renderingSelectedFiles) {
    const selectedFilesTree = convertSelectedFilesToTree(selectedFilesCopy);
    const pathParts = findKeyPath(selectedFilesTree, name);

    console.log(selectedFilesTree)
    console.log(pathParts)

    console.log(getNestedProperty(fileTreeCopy, pathParts))


    if (getNestedProperty(fileTreeCopy, pathParts) !== undefined) {

      let target = fileTreeCopy;
      for (const part of  pathParts) {
        target = target[part];
      }
      
      addNestedObject(
        target,
        pathParts,
        getNestedProperty(selectedFilesTree, pathParts)
      );
      console.log(getNestedProperty(selectedFilesTree, pathParts))
  

      //mergeObjectsAtPath(coptFileTreeLeftPanel, selectedFilesTree, pathParts);
      removeNestedKey(
        selectedFilesTree,
        pathParts.slice(0, -1),
        pathParts.at(-1)
      );
      //setSelectedFiles(fileTreeToFileObjectsArray(selectedFilesTree));
      //setFileTree(coptFileTreeLeftPanel);
    }



  } else {
  }

  console.log("After Folder Move ", fileTreeCopy, selectedFilesCopy)
};

export const renderFileTree = (tree, sort) => {
  let sortedTreeEntries = Object.entries(tree);

  if (sort === true) {
    sortedTreeEntries = Object.entries(tree).sort(([nameA], [nameB]) =>
      nameA.localeCompare(nameB)
    );
  }

  return sortedTreeEntries.map(([name, value]) => {
    if (Array.isArray(value)) {
      return html` <li class="file">
        ${value.map((file) => {
          return html`
            <div>
              <span>${file.name}</span>
            </div>
          `;
        })}
      </li>`;
    } else {
      return html`
        <li class="folder">
          <input type="checkbox" id=${name} />
          <label for=${name} onClick=${toggleFolder}>${name}</label>
          <ul style="display:none;">
            ${renderFileTree(value, sort)}
          </ul>
        </li>
      `;
    }
  });
};

export const fun2 = (event) => {
  console.log("hiii")
}

export const toggleFolder = (event) => {
  const ul = event.target.nextElementSibling;
  if (ul.style.display === "none") {
    ul.style.display = "block";
  } else {
    ul.style.display = "none";
  }
};

export const getNestedProperty = (obj, keys) => {
  return keys.reduce(
    (acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined),
    obj
  );
};

export const removeNestedKey = (obj, keys, keyToRemove) => {
  // Use the helper function to get the nested object
  const nestedObj = getNestedProperty(obj, keys);

  // If the nested object and key exist, delete the key
  if (nestedObj && nestedObj.hasOwnProperty(keyToRemove)) {
    delete nestedObj[keyToRemove];
  }
};

export function addNestedObject(target, path, source) {
  console.log("target : ", target)
  console.log("path ", path)
  console.log("source ", source)
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (typeof source[key] === "object" && !Array.isArray(source[key])) {
        if (!target[key]) {
          target[key] = {};
        }
        addNestedObject(target[key], source[key], path);
      } else {
        target[key] = source[key];
      }
    }
    else{
  
    }
  }
}
/*
export const addNestedObject = (obj, keys, newObj) => {
  // Use the helper function to get the nested object
  let currentObj = obj;
  for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!currentObj.hasOwnProperty(key)) {
          currentObj[key] = {};
      }
      currentObj = currentObj[key];
  }

  // Handle the case where the path already exists
  if (
      currentObj.hasOwnProperty(keys[keys.length - 1]) &&
      typeof currentObj[keys[keys.length - 1]] === "object" &&
      typeof newObj === "object"
  ) {
      // If the key already exists and both values are objects, merge them
      currentObj[keys[keys.length - 1]] = {
          ...currentObj[keys[keys.length - 1]],
          ...newObj,
      };
  } else {
      // Otherwise, just set the new object
      currentObj[keys[keys.length - 1]] = newObj;
  }

  // If the keys array has more than one element, we need to add back the nested structure
  for (let i = keys.length - 2; i >= 0; i--) {
      const key = keys[i];
      const nestedObj = {};
      nestedObj[key] = currentObj;
      currentObj = nestedObj;
  }

  // Merge the nested structure with the original object
  Object.assign(obj, currentObj);
};

*/

export const hasNestedArray = (obj) => {
  for (let key in obj) {
    if (Array.isArray(obj[key])) {
      return true; // Array found, return true
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      // If property is an object (not null), recursively check its properties
      if (hasNestedArray(obj[key])) {
        return true; // Array found in nested properties, return true
      }
    }
  }
  return false; // No array found
};

export function findKeyPath(obj, targetKey) {
  function search(obj, targetKey, path) {
    if (typeof obj !== "object" || obj === null) return null;
    if (obj.hasOwnProperty(targetKey)) return path.concat(targetKey);

    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        let result = search(obj[key], targetKey, path.concat(key));
        if (result) return result;
      }
    }
    return null;
  }
  return search(obj, targetKey, []);
}

export function fileTreeToFileObjectsArray(tree, basePath = "") {
  let result = [];

  for (const [key, value] of Object.entries(tree)) {
    if (typeof value === "object" && !Array.isArray(value)) {
      result = result.concat(
        fileTreeToFileObjectsArray(value, basePath + key + "/")
      );
    } else if (Array.isArray(value)) {
      value.forEach((file) => {
        result.push({
          name: file.name,
          path: null,
          size: null,
          webkitRelativePath: basePath + key + "/" + file.webkitRelativePath,
          type: null,
          lastModifiedDate: "",
          lastModified: null,
        });
      });
    }
  }

  return result;
}

function mergeObjects(obj1, obj2) {
  for (let key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      if (typeof obj2[key] === "object" && obj2[key] !== null) {
        obj1[key] = obj1[key] || {};
        mergeObjects(obj1[key], obj2[key]);
      } else {
        obj1[key] = obj2[key];
      }
    }
  }
  return obj1;
}

function mergeObjectsAtPath(obj1, obj2, path) {
  const keys = path;
  let tempObj1 = obj1;
  let tempObj2 = obj2;

  for (let key of keys) {
    tempObj1 = tempObj1[key];
    tempObj2 = tempObj2[key];
    if (!tempObj1 || !tempObj2) {
      console.error("Path not found in one of the objects.");
      return;
    }
  }

  mergeObjects(tempObj1, tempObj2);
}


export function formTreeFromSelectedFiles(selectedFiles, directoryTree) {
  let tree = {}
  let rank = 0
  for (const selectedFile of selectedFiles) {
    const key = selectedFile["type"] === "file" ? selectedFile["name"] : selectedFile["folderName"]
    tree[key] = {}
    let target = tree[key]
    target[rank] = rank;

    if(selectedFile["type"] === "file"){
      target["value"] = [selectedFile]
      target["path"] = selectedFile["webkitRelativePath"]
    }
    else{
      const folderPath = selectedFile["folderPath"]
      console.log(directoryTree, folderPath.split("/"))
      target["value"] =  getNestedProperty(directoryTree, folderPath.split("/"))
      target["path"] = selectedFile["folderPath"]
      //objectToInsert[folderName] = getNestedProperty(directoryTree, folderPath.split("/"))
    }
    rank+=1;
  }

  console.log(tree)

  return tree
}




