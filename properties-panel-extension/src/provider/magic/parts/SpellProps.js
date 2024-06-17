import { TextFieldEntry, isTextFieldEntryEdited } from 'camunda-modeler-plugin-helpers/vendor/@bpmn-io/properties-panel';
import { is } from 'bpmn-js/lib/util/ModelUtil';

import { html } from 'htm/preact';
import { debounce } from 'min-dash';

import { useService } from 'camunda-modeler-plugin-helpers/vendor/bpmn-js-properties-panel';
import { React } from 'camunda-modeler-plugin-helpers/react';
import { Button } from '@mui/material';

import { Modal } from 'camunda-modeler-plugin-helpers/components'; 
//import CustomButton from '../../customComponents/CustomButton';




export default function(element, modeling, translate, injector) {
  
  return [
    {
      id: 'spell',
      element,
      modeling:modeling,
      translate:translate,
      injector:injector,
      component: Spell
      
    }
  ];
}




function Spell(props) {


  //const {useService} = yourModuleName;
  //const translateCopy = useService('translate');
  //console.log(useService)
  const { element, id, modeling, translate, injector} = props;

  const translateFun = injector.get('translate')
  const modelingFun = injector.get('modeling')
  //console.log(modeling)
  const modeling1 = useService('modeling');
  //const translate = useService('translate');
  //const debounce = useService('debounceInput');

  const getValue = () => {
    return element.businessObject.spell || '';
  };

  const setValue = (value) => {
    console.log(modelingFun)
    return modelingFun.updateProperties(element, {
      spell: value
    });
  };

  const handleButtonClick = () => {
    window.alert('Button clicked!');
  };

  

  //console.log(id,element,translate,getValue,setValue,debounce)

 

  return html`
    <${TextFieldEntry}
      id=${id}
      element=${element}
      description=${translate('Apply a black magic spell')}
      label=${translate('Spell')}
      getValue=${getValue}
      setValue=${setValue}
      debounce=${debounce}
      tooltip=${translate('Check available spells in the spellbook.')}
    />
  `;
}


