const path = require('path');

const formsData = require(path.resolve(process.cwd(), 'lib/forms_data.js'));


class FormComponent {
  constructor(data, form) {
    this._data = data;
    this.form = form;
  }

  save() {
    this.form.save();
  }
}


class Field extends FormComponent {
  get field() { return this._data.field || undefined; }

  get inputtype() { return this._data.inputtype || undefined; }

  get items() { return this._data.items || undefined; }
}


class Page extends FormComponent {
  constructor(data, form) {
    super(data, form);

    if (this._data.hasOwnProperty('fields')) {
      this._fields = this._data.fields.map(f => {
        let field = new Field(f, form);

        return field;
      });
    }
  }

  get page() { return this._data.page; }

  set page(value) { this._data.page = value; }

  get pagetype() { return this._data.pagetype; }

  set pagetype(value) { this._data.pagetype = value; }

  get heading() {
    // monkey patch until we deal with visible-if values
    let heading = this._data.heading;

    if (!Array.isArray(heading)) {
      return heading;
    } else {
      return undefined;
    }
  }

  set heading(value) { this._data.heading = value; }

  get guidance() { return this._data.guidance || undefined; }

  set guidance(value) { this._data.guidance = value; }

  get detail() { return this._data.detail || undefined; }

  set detail(value) { this._data.detail = value; }

  get fields() {
    return this._fields || undefined;
  }

  get next() { return this._data.next || undefined; }

  get url() { return `/forms/${this.form.name}/pages/${this.page}`; }

  save() {

  } 
}


class Organisation extends FormComponent {
  get name() { return this._data.name; }

  get organisation() { return this._data.organisation; }

  get website() { return this._data.website; }
}


class Form {
  constructor(data, fileName) {
    let form = this;
    let pages = data.pages;

    this._data = data;
    this.fileName = fileName;
    this._pages = [];
    this._pageIndices = {};
    
    for (let key in pages) {
      let page = new Page(pages[key], form);
      
      page.page = key;
      this._pageIndices[key] = this._pages.length;
      this._pages.push(page);
    };
  }

  get name() { return this._data.name; }

  get heading() { return this._data.heading; }

  get phase() { return this._data.phase; }

  get pages() {
    return this._pages;
  }

  get organisations() {
    let form = this;

    return this._data.organisations.map(o => {
      let org = new Organisation(o, form);

      return org;
    });
  }

  get url() { return `/forms/${this.name}`; }

  page(name) {
    return this._pageIndices.hasOwnProperty(name) ? this._pages[this._pageIndices[name]] : undefined;
  }

  getDataAsString () {
    return JSON.stringify(this._data, null, 2);
  }
}


module.exports = {
	'Field': Field,
	'Page': Page,
	'Organisation': Organisation,
	'Form': Form
};
