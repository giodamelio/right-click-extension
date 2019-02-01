const browser = require('webextension-polyfill');
const React = require('react');
const ReactDOM = require('react-dom');
const Mson = require('mson-react/lib/component').default;

const definition = {
  component: 'Form',
  fields: [
    {
      name: 'heading',
      component: 'Text',
      text: '# Options'
    },
    {
      name: 'jsonOpeners',
      component: 'TextField',
      required: true,
      multiline: true,
      fullWidth: true
    },
    {
      name: 'save',
      component: 'ButtonField',
      label: 'Save',
      type: 'submit',
      icon: 'save'
    }
  ]
};

const options = (
  <Mson
    definition={definition}
    onMount={({ component }) => {
      return browser.storage.local.get('openers').then(({ openers }) => {
        console.log('Loading options:', openers);
        component.setValues({
          jsonOpeners: JSON.stringify(openers, null, 2)
        });
      });
    }}
    onSave={({ component }) => {
      const openers = JSON.parse(component.getValues().jsonOpeners);
      console.log('Saving options:', openers);
      browser.storage.local.set({
        openers
      });
    }}
  />
);

ReactDOM.render(options, document.getElementById('root'));
