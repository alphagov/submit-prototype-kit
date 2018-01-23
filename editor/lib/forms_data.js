const fs = require('fs');
const path = require('path');

const dataDir = path.resolve(process.cwd(), '../examples');  
const encoding = 'utf8';
const dataFiles = [];
const forms = [];


class Page {
  constructor(data) {
    this.data = data;
  }
  get pagetype() { return this.data.pagetype; }
  get heading() { return this.data.heading || undefined; }
  get guidance() { return this.data.guidance || undefined; }
  get detail() { return this.data.detail || undefined; }
  get fields() {
    if (this.data.hasOwnProperty('fields')) {
      return this.data.fields.map(field => { new Field(field); });
    }
  }
  get next() { return this.data.next; }
}


class Organisation {
  constructor(data) {
    this.data = data;
  }
  get name() { return this.data.name; }
  get organisation() { return this.data.organisation; }
  get website() { return this.data.website; }
}


class Form {
  constructor(data) {
    this.data = data;
  }
  get name() { return this.data.name; }
  get heading() { return this.data.heading; }
  get phase() { return this.data.phase; }
  get pages() {
    return this.data.pages.forEach(page => new Page(page));
  }
  get organisations() {
    return this.data.organisations.map(org => new Organisation(org));
  }
}


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

      forms.push(new Form(data));
    })
  },
  getForm: function(formName) {
    let matches = forms.filter(form => { form.name === formName });

    return matches.length ? matches[0] : null;
  },
  getAll: function() {
    return forms;
  }
}


module.exports = formsData;
