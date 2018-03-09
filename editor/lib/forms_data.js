const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const request = require('request');

// set up constants for form model
var Form;

// import the classes for the models
({ Form } = require(path.resolve(process.cwd(), 'app/models')));

const dataDir = path.resolve(process.cwd(), '../examples');  
const encoding = 'utf8';
const dataFiles = [];
const forms = [];


const poll = function (onReady) {
  let url = 'http://localhost:3000';
  let opts = {
    'url': url,
    'method': 'HEAD'
  };
  let pollServer;
  let onResponse;
  
  pollServer = function () {
    request(opts, onResponse);
  };

  onResponse = function (error, response, body) {
    if (!error && response.statusCode === 200) {
      onReady();
    } else {
      pollServer();
    }
  };

  pollServer();
};


const formsData = {
  init: function() {
    let jsonFile = RegExp('.+\.json$');

    // if init has been called already, quit
    if (dataFiles.length && forms.length) { return; }

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
    let checkServerIsUp;

    checkServerIsUp = function () {
      poll(cb);
    };

    rebuildPages = function () {
      childProcess.exec('make', { "cwd": path.resolve(process.cwd(), '../') }, (error, stdout, stderr) => {
        console.log(stdout);

        // TODO: deal with errors from rebuilding the pages
        if (error) {
          console.log(`make process exited with ${error.code}`);
          cb(error);
        } else {
          // wait until server has restarted until calling callback
          checkServerIsUp();
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
