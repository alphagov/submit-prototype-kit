const fs = require('fs');
const path = require('path');

const dataDir = path.resolve(process.cwd(), '../examples');  
const encoding = 'utf8';
const dataFiles = [];
const forms = [];


class FormComponent {
  constructor(data, form) {
    this.data = data;
    this.form = form;
  }

  save() {
    this.form.save();
  }
}


class Field extends FormComponent {
  get field() { return this.data.field || undefined; }

  get inputtype() { return this.data.inputtype || undefined; }

  get items() { return this.data.items || undefined; }
}


class Page extends FormComponent {
  constructor(data, form) {
    super(data, form);

    if (this.data.hasOwnProperty('fields')) {
      this._fields = this.data.fields.map(f => {
        let field = new Field(f, form);

        return field;
      });
    }
  }

  get page() { return this.data.page; }

  set page(value) { this.data.page = value; }

  get pagetype() { return this.data.pagetype; }

  set pagetype(value) { this.data.pagetype = value; }

  get heading() {
    // monkey patch until we deal with visible-if values
    let heading = this.data.heading;

    if (!Array.isArray(heading)) {
      return heading;
    } else {
      return undefined;
    }
  }

  set heading(value) { this.data.heading = value; }

  get guidance() { return this.data.guidance || undefined; }

  set guidance(value) { this.data.guidance = value; }

  get detail() { return this.data.detail || undefined; }

  set detail(value) { this.data.detail = value; }

  get fields() {
    return this._fields || undefined;
  }

  get next() { return this.data.next || undefined; }

  get url() {
    let methods = {
          post: `/forms/${this.form.name}/pages/${this.page}`
        };
    
    // point gets for index pages to the parent root
    let page = (this.page === 'index') ? '' : this.page;

    methods.get = `/forms/${this.form.name}/pages/${page}`

    return methods;
  }

  save() {

  } 
}


class Organisation extends FormComponent {
  get name() { return this.data.name; }

  get organisation() { return this.data.organisation; }

  get website() { return this.data.website; }
}


class Form {
  constructor(data, fileName) {
    let form = this;

    this.data = data;
    this.fileName = fileName;

    this._pages = this.data.pages.map(p => {
      var page = new Page(p, form);
      
      return page;
    });
  }

  get name() { return this.data.name; }

  get heading() { return this.data.heading; }

  get phase() { return this.data.phase; }

  get pages() {
    return this._pages;
  }

  get organisations() {
    let form = this;

    return this.data.organisations.map(o => {
      let org = new Organisation(o, form);

      return org;
    });
  }

  get url() {
    return {
      get: `/forms/${this.name}`,
      post: `/forms/${this.name}`
    };
  }

  page(name) {
    let matches = this._pages.filter(page => { return page.page === name });

    return (matches.length) ? matches[0] : undefined;
  }

  save() {
    let dataStr = JSON.serialize(this.data);

    fs.writeFileSync(this.fileName, dataStr, { "encoding": encoding })
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

      forms.push(new Form(data, fileName));
    })
  },

  getForm: function(formName) {
    let matches = forms.filter(form => { return form.name === formName });

    return matches.length ? matches[0] : null;
  },

  getAll: function() {
    return forms;
  }
}


module.exports = formsData;
