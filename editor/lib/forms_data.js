const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

// set up constants for models
var Form, Page, Organisation, Field;

// import the classes for the models
({ Field, Page, Organisation, Form } = require(path.resolve(process.cwd(), 'app/models')));

const dataDir = path.resolve(process.cwd(), '../examples');  
const encoding = 'utf8';
const dataFiles = [];
const forms = [];


const formsData = {
  init: function() {
    let jsonFile = RegExp('.+\.json$');

    // get files
    fs.readdirSync(dataDir).forEach(file => dataFiles.push(file));

    // load data
    dataFiles.forEach(file => {
      if (!jsonFile.test(file)) { return; }

      let fileName = path.resolve(dataDir, file);
      let data = JSON.parse(fs.readFileSync(fileName, encoding));

      forms.push(new Form(data, fileName));
    })
  },

  getForm: function(formName) {
    let matches = forms.filter(form => { return form.name === formName });

    return matches.length ? matches[0] : null;
  },

  getAll: function() {
    return forms;
  },

  save: function(form) {
    let JSONStr = form.getDataAsString();

    try {
      fs.writeFileSync(this.fileName, JSONStr, { "encoding": encoding });
    }
    catch (error) {
      return { "success": false, "error": error };
    }

    // rebuild the app from the new data
    try {
      childProcess.execSync('make', { "cwd": path.resolve(process.cwd(), '../') });
    }
    catch (error) {
      return { "success": false, "error": error };
    }
    return { "success": true };
  }
}


module.exports = formsData;
