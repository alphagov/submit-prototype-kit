const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');


const GraphData = {
  init(formname) {
    this.command = 'bin/lint.py';
    this.opts = { 'cwd': path.resolve(process.cwd(), '../') }
    this.dataFile = `examples/${formname}.json`;
  },

  runCommand(output, onSuccess, onError) {
    let command = `${this.command} --output ${output} ${this.dataFile}`;

    childProcess.exec(command, this.opts, (error, stdout, stderr) => {
      console.log(`${command} completed`);
      if (error) {
        onError(error);
      } else {
        onSuccess(stdout);
      }
    })
  },

  getGraph(onSuccesss, onError) {
    this.runCommand('graph', onSuccesss, onError);
  },

  getLinks(onSuccesss, onError) {
    this.runCommand('links', onSuccesss, onError);
  },

  getPaths(onSuccesss, onError) {
    this.runCommand('paths', onSuccesss, onError);
  },

  getGraphAndLinks(onSuccess, onError) {
    let self = this;
    let getGraph = function () {
      return new Promise(function(resolve, reject) {
        self.getGraph((output) => {
          resolve(output);
        }, reject);
      });
    };
    let getLinks = function () {
      return new Promise(function(resolve, reject) {
        self.getLinks((output) => {
          resolve(output);
        }, reject);
      });
    };

    async function getData() {
      let graph = await getGraph();
      let links = await getLinks();

      return {
        'graph': graph,
        'links': links
      }
    };

    getData().then((data) => {
      onSuccess(data);
    });
  }
};

module.exports = GraphData;
