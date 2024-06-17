// Import your custom property entries.
// The entry is a text input field with logic attached to create,
// update and delete the "spell" property.
import calledDecisionCustomProps from './parts/CalledDecisionCustomProps';
import { ZeebePropertiesProviderModule } from 'camunda-modeler-plugin-helpers/vendor/bpmn-js-properties-panel';
const LOW_PRIORITY = 500;


/**
 * A provider with a `#getGroups(element)` method
 * that exposes groups for a diagram element.
 *
 * @param {PropertiesPanel} propertiesPanel
 * @param {Function} translate
 */
export default function CalledDecisoinCustomProvider(propertiesPanel, translate) {

  

  // API ////////

  /**
   * Return the groups provided for the given element.
   *
   * @param {DiagramElement} element
   *
   * @return {(Object[]) => (Object[])} groups middleware
   */
  this.getGroups = function(element) {

    /**
     * We return a middleware that modifies
     * the existing groups.
     *
     * @param {Object[]} groups
     *
     * @return {Object[]} modified groups
     */
    return function(groups) {

      // Add the "magic" group
      
      /*
      const listenerCustomInstance = new ListenerCustom(); // Create an instance
      
      */


      
      
      
        groups.push(createCalledDecisionCustomGroup(element, translate));


      

      //remove existing Called Decision tab 
      const filteredTabs = groups.filter(tab => tab !== null && tab.id !== 'calledDecision9');
      
      return filteredTabs;
    };
  };


  // registration ////////

  // Register our custom magic properties provider.
  // Use a lower priority to ensure it is loaded after
  // the basic BPMN properties.
  propertiesPanel.registerProvider(LOW_PRIORITY, this);
}

CalledDecisoinCustomProvider.$inject = [ 'propertiesPanel', 'translate']

// Create the custom magic group
function  createCalledDecisionCustomGroup(element, translate) {


    const calledDecisionCustomGroup = {
        id: 'calledDecisionCustom',
        label : translate('Custom Called Decision'),
        entries: [...calledDecisionCustomProps({element})],
        tooltip: translate('This is a modified version of Called Decision Tab to meet our needs!!')
        //component : non_known
    };

    return calledDecisionCustomGroup.entries.length ? calledDecisionCustomGroup : null;

    /*

    // create a group called "Magic properties".
  const magicGroup = {
    id: 'magic',
    label: translate('Magic properties'),
    entries: spellProps(element, modeling, translate),
    tooltip: translate('Make sure you know what you are doing!')
    */

  };
