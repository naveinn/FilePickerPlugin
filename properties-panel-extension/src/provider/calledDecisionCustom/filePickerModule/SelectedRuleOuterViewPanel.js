import { html } from "htm/preact";
import { h } from "preact";
import {
  useState,
  useEffect,
} from "camunda-modeler-plugin-helpers/vendor/@bpmn-io/properties-panel/preact/hooks";
import "./dialog.css";
import { React } from "camunda-modeler-plugin-helpers/vendor/react";
import {
  decorateResponse,
  convertSelectedFilesToTree,
  renderFileTree,
  formTreeFromSelectedFiles,
} from "./Utils/utils";

const SelectedRuleOuterViewPanel = ({
  getValue,
  element,
  dialogState,
  directoryTree,
}) => {
  const [selectedFilesTree, setSelectedFilesTree] = useState(
    formTreeFromSelectedFiles(
      decorateResponse(getValue(), directoryTree),
      directoryTree
    )
  );

  useEffect(() => {
    setSelectedFilesTree(
      formTreeFromSelectedFiles(
        decorateResponse(getValue(), directoryTree),
        directoryTree
      )
    );
  }, [dialogState,element]);

  return html`
    <div style="padding: 10px;">
      <div class="panel">
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
  `;
};

export default SelectedRuleOuterViewPanel;
