/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

import { PureComponent } from 'camunda-modeler-plugin-helpers/react';
global.centralDataBus = {}

const { ipcRenderer } = require('electron');
//global.directoryTree = {}


/**
 * An extension that shows how to hook into
 * editor events to accomplish the following:
 *
 * - hook into <bpmn.modeler.configure> to provide a bpmn.modeler extension
 * - hook into <bpmn.modeler.created> to register for bpmn.modeler events
 * - hook into <tab.saved> to perform a post-safe action
 *
 */

async function readFile(filePath) {
  try {
    const data = await ipcRenderer.invoke('read-file', filePath);
    console.log(`File contents: ${data}`);
  } catch (error) {
    console.error('Error reading file:', error);
  }
}


export default class ListenerCustom extends PureComponent {

  constructor(props) {

    super(props);
    this.cenrtalDataBusFromListner = new Map(); // Initialize the map

    const {
      subscribe
    } = props;

    subscribe('bpmn.modeler.configure', (event) => {

      const {
        
        tab,
        middlewares
      } = event;
      global.centralDataBus['ruleProjectBasePath']= event?.tab?.file?.path?.substring(0, event?.tab?.file?.path?.indexOf("RuleProject") + "RuleProject".length);
      //console.log(event?.tab?.file?.path)


      log('Creating editor for tab ', tab);

    });

    subscribe('my.custom.event', (event) => {

      console.log(event)

    });

  }

  // Getter method to access the dataMap
  getDataMap() {
    return this.cenrtalDataBusFromListner;
  }

  // Setter method to insert a key-value pair
  setData(key, value) {
    this.cenrtalDataBusFromListner.set(key, value);
  }

  render() {
    return null;
  }
}


// helpers //////////////

function log(...args) {
  console.log('[TestEditorEvents]', ...args);
  readFile('/path/to/your/file.txt') 
}

