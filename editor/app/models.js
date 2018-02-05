const path = require('path');

const formsData = require(path.resolve(process.cwd(), 'lib/forms_data.js'));


class Field {
  constructor(data, parentComponent) {
    this._data = data;
    this.parentComponent = parentComponent;

    if (this._data.hasOwnProperty('items')) {
      this._items = this._data.items.map((item, idx) => {
        item.idx = idx;

        return new FieldItem(item, this);
      });
    }
  }

  get label() { return this._data.label || undefined; }

  get hint() { return this._data.hint || undefined; }

  get legend() { return this._data.legend || undefined; }

  get items() { return this._items || []; }

  get namespace() { return [this.parentComponent.namespace, `fields[${this._data.name}]`].join('.'); }

  get id() { return this.namespace; }
}


class FieldItem {
  constructor(data, parentComponent) {
    this._data = data;
    this.parentComponent = parentComponent;
  }

  get label() { return this._data.label || undefined; }

  get value() { return this._data.value || undefined; }

  get hint() { return this._data.hint || undefined; }

  get id() { return [this.parentComponent.namespace, `items[${this._data.idx}]`].join('.'); }
}


class Fieldset extends Field {
  constructor(data, field) {
    super(data, field);

    this._fields = this._data.fields.map(f => {
      let field = form.createField(f, this)

      fields.push(field);
    });
  }

  get isFieldset() { return true; }

  get fields() { return this._fields || []; }
}


class FormComponent {
  constructor(data, form) {
    this._data = data;
    this.form = form;
  }
}


class Page extends FormComponent {
  constructor(data, form) {
    super(data, form);

    if (this._data.hasOwnProperty('fields')) {
      this._fields = this._data.fields.map(f => { return form.createField(f, this) });
    }
  }

  get page() { return this._data.page; }

  set page(value) { this._data.page = value; }

  get pagetype() { return this._data.pagetype; }

  set pagetype(value) { this._data.pagetype = value; }

  get heading() { return this._data.heading; }

  set heading(value) { this._data.heading = value; }

  get guidance() { return this._data.guidance || undefined; }

  set guidance(value) { this._data.guidance = value; }

  get detail() { return this._data.detail || undefined; }

  set detail(value) { this._data.detail = value; }

  get fields() {
    return this._fields || [];
  }

  get next() { return this._data.next || undefined; }

  get namespace() { return `pages[${this.page}]`; }

  get id() { return this.namespace; }

  get url() { return `/forms/${this.form.name}/pages/${this.page}`; }

  update(newData) {
    let updateDataset = function (changedProp, dataset) {
      if (dataset.hasOwnProperty(prop)) {
        dataset[prop] = newData[prop];
      }
    };

    for (let prop in newData) {

      // check page-level properties
      updateDataset(prop, this);

      // check fields in page
      for (field in this.fields) {
        updateDataset(prop, field);

        // check items in field
        for (item in field.items) {
          updateDataset(prop, item);
        }

      }

    }

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

  set heading(value) { this._data.heading = value; }

  get phase() { return this._data.phase; }

  set phase(value) { this._data.phase = value; }

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

  createField(name, parentComponent) {
    let fieldData;
    let fieldClass;

    fieldData = this._data.fields[name];
    fieldData.name = name;

    if (fieldData.hasOwnProperty('fields')) {
      return new Fieldset(fieldData, parentComponent);
    }

    return new Field(fieldData, parentComponent);
  }

  update(newData) {
    for (let prop in newData) {
      // update any page properties
      if (this.hasOwnProperty(prop)) { this[prop] = newData[prop]; }
    }
  } 
}


module.exports = {
	'Field': Field,
	'Page': Page,
	'Organisation': Organisation,
	'Form': Form
};
