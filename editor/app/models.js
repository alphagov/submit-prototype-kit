const path = require('path');


const _getDatapoint = function(namespace, root) {
  let keys = namespace.match(/[^\.\[\]]+/g);
  let datapoint = root;
  let lastKey = keys.pop();

  if (!keys) { return false; }

  // for each key, check for it on current object to work down tree
  for (let idx = 0; idx < keys.length; idx++) {
    let key = keys[idx];

    if (key in datapoint === false) {
      datapoint = false;
      break;
    }

    datapoint = datapoint[key];
  };

  if (!datapoint) { return false; }

  return {
    'obj': datapoint,
    'key': lastKey
  };
};


class Field {
  constructor(data, parentComponent) {
    this._data = data;
    this.parentComponent = parentComponent;

    if ('items' in this._data) {
      this._items = this._data.items.map((item, idx) => {
        let fieldItem = new FieldItem(item, this);

        fieldItem.index = idx;

        return fieldItem;
      });
    }
  }

  // Read/write properties

  get label() { return this._data.label || undefined; }

  set label(value) { this._data.label = value; }

  get hint() { return this._data.hint || undefined; }

  set hint(value) { this._data.hint = value; }

  get legend() { return this._data.legend || undefined; }

  set legend(value) { this._data.legend = value; }

  // Read-only properties

  get items() { return this._items || []; }

  get id() {
    return [this.parentComponent.id, `fields[${this.index}]`].join('.');
  }
}


class FieldItem {
  constructor(data, parentComponent) {
    this._data = data;
    this.parentComponent = parentComponent;
  }

  // Read/write properties

  get label() { return this._data.label || undefined; }

  set label(value) { this._data.label = value; }

  get hint() { return this._data.hint || undefined; }

  set hint(value) { this._data.hint = value; }

  // Read-only properties

  get value() { return this._data.value || undefined; }

  get id() {
    return [this.parentComponent.id, `items[${this.index}]`].join('.');
  }
}


class Fieldset extends Field {
  constructor(data, field) {
    super(data, field);

    this._fields = this._data.fields.map((f, idx) => {
      let field = form.createField(f, this)

      field.name = f;
      field.index = idx;

      return field;
    });
  }

  // Read-only properties

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

    if ('fields' in this._data) {
      this._fields = this._data.fields.map((f, idx) => {
        let field = form.createField(f, this);
        
        field.name = f;
        field.index = idx;

        return field;
      });
    }
  }

  // Read/write properties

  get pagetype() { return this._data.pagetype; }

  set pagetype(value) { this._data.pagetype = value; }

  get heading() { return this._data.heading; }

  set heading(value) { this._data.heading = value; }

  get guidance() { return this._data.guidance || undefined; }

  set guidance(value) { this._data.guidance = value; }

  get detail() { return this._data.detail || undefined; }

  set detail(value) { this._data.detail = value; }

  // Read-only properties

  get fields() {
    return this._fields || [];
  }

  get next() { return this._data.next || undefined; }

  get id() { return `pages[${this.page}]`; }

  get url() { return `/forms/${this.form.name}/pages/${this.page}`; }

  // Methods

  update(newData) {
    // check page-level properties
    for (let prop in newData) {
      let value = newData[prop];
      let currentDatapoint = _getDatapoint(prop, this.form);

      // update data point if value sent in is different
      if (currentDatapoint) {
        let { obj, key } = currentDatapoint;

        if (obj[key] !== value) { obj[key] = value; }
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
    this._pages = {};
    
    for (let key in pages) {
      let page = new Page(pages[key], form);
      
      page.page = key;
      this._pages[key] = page;
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
    return (name in this._pages) ? this._pages[name] : undefined;
  }

  getPagesList() {
    return Object.values(this._pages); 
  }

  getDataAsString () {
    return JSON.stringify(this._data, null, 2);
  }

  createField(name, parentComponent) {
    let fieldData;
    let fieldClass;

    fieldData = this._data.fields[name];

    if ('fields' in fieldData) {
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
