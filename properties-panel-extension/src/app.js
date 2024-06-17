import {
  registerBpmnJSPlugin,
  registerBpmnJSModdleExtension,
  registerCloudBpmnJSPlugin,
  registerClientExtension,
  registerCloudDmnJSPlugin
} from 'camunda-modeler-plugin-helpers';

//import BpmnModeler from 'bpmn-js/lib/Modeler';


import magicPropertiesProviderModule from './provider/magic';
import magicModdleDescriptor from './descriptors/magic.json';
import activeViewPlugin from './active-view-plugin';

import calledDecisoinCustomProviderModule from './provider/calledDecisionCustom';
import calledDecisionCustomDescriptor from './descriptors/customDecision.json';

import ListenerCustom from './listener/ListenerCustom';

const fs = require('fs');
console.log(fs)



// Register additional modules as plugins
//registerBpmnJSPlugin(BpmnPropertiesPanelModule);
//registerBpmnJSPlugin(BpmnPropertiesProviderModule);
registerCloudBpmnJSPlugin(magicPropertiesProviderModule);
registerCloudBpmnJSPlugin(calledDecisoinCustomProviderModule);
registerCloudDmnJSPlugin(activeViewPlugin);

// Register Moddle extensions
registerBpmnJSModdleExtension(magicModdleDescriptor);
registerBpmnJSModdleExtension(calledDecisionCustomDescriptor);
registerClientExtension(ListenerCustom);
