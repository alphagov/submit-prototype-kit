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

  save: function(form, cb) {
    let JSONStr = form.getDataAsString();
    let rebuildPages;

    rebuildPages = function () {
      childProcess.exec('make', { "cwd": path.resolve(process.cwd(), '../') }, (error, stdout, stderr) => {
        console.log(stdout);

        // TODO: deal with errors from rebuilding the pages
        if (error) {
          console.log(`make process exited with ${error.code}`);
          cb(error);
        } else {
          cb();
        }
      });
    };

    fs.writeFile(form.fileName, JSONStr, { "encoding": encoding }, (error) => {
      if (error) {
        cb(error);
      }

      // rebuild the app from the new data
      rebuildPages();
    });
  }
}


module.exports = formsData;
