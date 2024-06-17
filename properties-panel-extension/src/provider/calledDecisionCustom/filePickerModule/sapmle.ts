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
  
    // Set the new object at the specified path
    const lastKey = keys[keys.length - 1];
    if (
      currentObj.hasOwnProperty(lastKey) &&
      typeof currentObj[lastKey] === "object" &&
      typeof newObj === "object"
    ) {
      // If the key already exists and both values are objects, merge them
      currentObj[lastKey] = { ...currentObj[lastKey], ...newObj };
    } else {
      // Otherwise, just set the new object
      currentObj[lastKey] = newObj;
    }
  };
  
  in the above code its not handling the nested case 
  
  for Ex lets say I have an json object :
  
  {
      "RuleProject": {
          "DetermineAuthorizer": {
            "Card3ds": {
              "Decline_Installment_Txns_based_On_Instalment_Amount.dmn": [
                  { name: fileName, path: null, size: null, webkitRelativePath: filePath, type: null, lastModifiedDate: '', lastModified: null }
              ],
              "Determine reauth days, lower limit, upper limit.dmn": [
                  { name: fileName, path: null, size: null, webkitRelativePath: filePath, type: null, lastModifiedDate: '', lastModified: null }
              ],
              "SetRoutingCountry.dmn": [
                  { name: fileName, path: null, size: null, webkitRelativePath: filePath, type: null, lastModifiedDate: '', lastModified: null }
              ],
              "Decline_Installment_Txns_Based_On_Txn_Amount.dmn": [
                  { name: fileName, path: null, size: null, webkitRelativePath: filePath, type: null, lastModifiedDate: '', lastModified: null }
              ],
              "Decline_Installment_Txns_Based_On_Amount.dmn": [
                  { name: fileName, path: null, size: null, webkitRelativePath: filePath, type: null, lastModifiedDate: '', lastModified: null }
              ]
          }
      }
  }
}
  
  and I am trying to add object 
  
  {
      "DetermineAuthorizer": {
          "Card3ds": {
              "Initalize Card3ds Lookup vars.dmn": [
                  {}
              ]
          }
      }
  }
  
  and if the part parts in this case is ['RuleProject']
  
  I am getting the output as  

  {
    "RuleProject": {
        "DetermineAuthorizer": {
            "Card3ds": {
                "Initalize Card3ds Lookup vars.dmn": [
                    {}
                ]
            }
    }
}
}

here i am missing the above previous object which was under card#ds, can u modify the code to handle this nested case as well

i mean here i expect the output to be 



<div>
<${SelectedRuleOuterViewPanel}
  getValue=${getValue}
  dialogState=${isDialogOpen}
/>
</div>

<input
                id="ruleDirRefresh"
                style="display: none;"
                type="file"
                onChange=${handleFileChange}
                directory
                webkitdirectory
                value=${global.centralDataBus["ruleProjectBasePath"]}
              />

              <button onclick=${openFileInput}">Choose Directory</button>
