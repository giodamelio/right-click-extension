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
      name: 'jsonConfig',
      component: 'TextField',
      required: true,
      multiline: true
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
      component.setValues({
        jsonConfig: '[\n\n]'
      });
    }}
    onSave={({ component }) => {
      alert(JSON.stringify(component.getValues()));
    }}
  />
);

ReactDOM.render(options, document.getElementById('root'));
