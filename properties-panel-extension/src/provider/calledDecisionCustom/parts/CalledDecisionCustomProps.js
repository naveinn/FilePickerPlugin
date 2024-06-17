import { TextFieldEntry, isTextFieldEntryEdited } from 'camunda-modeler-plugin-helpers/vendor/@bpmn-io/properties-panel';
import { is, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { html } from 'htm/preact';

import { useService } from 'camunda-modeler-plugin-helpers/vendor/bpmn-js-properties-panel';
import FilePicker from '../filePickerModule/FilePicker';
import 'preact-material-components/Button/style.css';
import 'preact-material-components/Theme/style.css';


function getCalledDecision(element) {
  const businessObject = getBusinessObject(element);

  return getExtensionElementsList(businessObject, 'zeebe:CalledDecision')[0];
}

function getExtensionElementsList(businessObject, type = undefined) {
  const extensionElements = businessObject.get('extensionElements');

  if (!extensionElements) {
    return [];
  }

  const values = extensionElements.get('values');

  if (!values || !values.length) {
    return [];
  }

  if (type) {
    return values.filter(value => is(value, type));
  }

  return values;
}


export default function(props) {

  const {element} = props;

  if (!is(element, 'bpmn:BusinessRuleTask') || !getCalledDecision(element)) {
    return [];
  }
  
  return [
    {
      id: 'calledDecisionCustomProps',
      component: CalledDecisionCustom,
      isEdited: true //need to write custom function here
    }
  ];
}




function CalledDecisionCustom(props) {
  const { element, id } = props;

  const commandStack = useService('commandStack');
  const bpmnFactory = useService('bpmnFactory');
  const translate = useService('translate');
  const debounce = useService('debounceInput');
  const eventBus = useService('eventBus');

  eventBus.on('shape.added', (event) => {
    const activeTab = event.activeTab;
    if (activeTab && activeTab.file && activeTab.file.path) {
      const filePath = activeTab.file.path;
    }
  });

  const getValue = () => {
    return (getCalledDecision(element) || {});
  };

  const setValue = (value) => {
    const commands = [];

    const businessObject = getBusinessObject(element);

    let extensionElements = businessObject.get('extensionElements');

    // (1) ensure extension elements
    if (!extensionElements) {
      extensionElements = createElement(
        'bpmn:ExtensionElements',
        { values: [] },
        businessObject,
        bpmnFactory
      );

      commands.push({
        cmd: 'element.updateModdleProperties',
        context: {
          element,
          moddleElement: businessObject,
          properties: { extensionElements }
        }
      });
    }

    // (2) ensure calledDecision
    let calledDecision = getCalledDecision(element);

    if (!calledDecision) {
      calledDecision = createElement(
        'zeebe:CalledDecision',
        { },
        extensionElements,
        bpmnFactory
      );

      commands.push({
        cmd: 'element.updateModdleProperties',
        context: {
          element,
          moddleElement: extensionElements,
          properties: {
            values: [ ...extensionElements.get('values'), calledDecision ]
          }
        }
      });
    }

    // (3) update caledDecision.decisionId
    commands.push({
      cmd: 'element.updateModdleProperties',
      context: {
        element,
        moddleElement: calledDecision,
        properties: { decisionId: value }
      }
    });

    // (4) commit all updates
    commandStack.execute('properties-panel.multi-command-executor', commands);
  };

  return html`<${FilePicker}
  getValue=${getValue}
  setValue=${setValue}
  element=${element}
/>
`;
}


