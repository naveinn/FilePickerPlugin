import { html } from 'htm/preact';
import { React } from 'camunda-modeler-plugin-helpers/react';
import { useState, useRef } from 'camunda-modeler-plugin-helpers/vendor/@bpmn-io/properties-panel/preact/hooks';
import Dialog from 'preact-material-components/Dialog';
import Button from 'preact-material-components/Button';
import List from 'preact-material-components/List';
import 'preact-material-components/List/style.css';
import 'preact-material-components/Button/style.css';
import 'preact-material-components/Dialog/style.css';

const dialogStyle = {
  zIndex: 9999 // Set the z-index to a high value
};

const DialogPage = () => {
  const scrollingDlgRef = useRef(null); // Ref to the Dialog component

  const handleButtonClick = () => {
    // Open the dialog when the button is clicked
    if (scrollingDlgRef.current) {
      scrollingDlgRef.current.MDComponent.show();
    }
  };

  return html`
    <div>
      <${Button} raised onClick=${handleButtonClick}>
        Show Scrollable Dialog
      </${Button}>
      <${Dialog} ref=${scrollingDlgRef} style=${dialogStyle}>
        <${Dialog.Header}>Use Google's location service?</${Dialog.Header}>
        <${Dialog.Body} scrollable>
          Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
            <li>Item 4</li>
            <li>Item 5</li>
          </ul>
        </${Dialog.Body}>
        <${Dialog.Footer}>
          <${Dialog.FooterButton} cancel>Decline</${Dialog.FooterButton}>
          <${Dialog.FooterButton} accept>Accept</${Dialog.FooterButton}>
        </${Dialog.Footer}>
      </${Dialog}>
    </div>
  `;
};

export default DialogPage;