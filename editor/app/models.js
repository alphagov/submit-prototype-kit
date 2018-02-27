const path = require('path');
const utils = require('../../lib/utils.js');


class Datapoint {
  constructor(namespace, form) {
    this.form = form;
    this.keys = namespace.match(/[^\.\[\]]+/g);
    this.key = this.keys[this.keys.length - 1];
    this.instance = this.getInstance();
  }

  // Properties

  get value() {
    return this.instance[this.key];
  }

  set value(value) {
    this.instance[this.key] = value;
  } 

  get exists() {
    return this.instance !== false;
  }

  // public methods

  getInstance() {
    let inst = this.form;
    let keys = this.keys;

    keys.pop();

    for (let idx = 0; idx < keys.length; idx++) {
      let key = keys[idx];

      if (key in inst) {
        inst = inst[key];
      } else {
        inst = false;
        break;
      }
    }

    return inst;
  }
};


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
  constructor(data, form) {
    this._data = data;
    this.form = form;

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

  // Read-only properties

  get items() { return this._items || []; }

  get id() {
    return `fields[${this.name}]`;
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


class Fieldset {
  constructor(data, form) {
    this._data = data;
    this.form = form;

    this._fields = this._data.fields.map(name => {
      return form.createField(name)
    });
  }

  // Read-only properties

  get fields() { return this._fields || []; }

  // Read/write properties

  get legend() { return this._data.legend || undefined; }

  set legend(value) { this._data.legend = value; }
}


class FormComponent {
  constructor(data, form) {
    this._data = data;
    this.form = form;
  }
}


class Next {
  constructor(data, page) {
    this._data = data;
    this._page = page;

    // If there's only one potential next page, get/set it on the page data
    // Otherwise, pass the actions through to the current instance
    let propOptions = {};

    let createMethods = function(key) {
      return {
        get: (function() {
          return function() {
            return this._data[key];
          };
        })(),

        set: (function() {
          return function(value) {
            if (this._page._next.length === 1) {
              this._page._data.next = value;
            } else {
              // if more than one next step, use this instance
              this._data[key] = value;
            }
          };
        })()
      }
    };

    ['page', 'if'].forEach(key => { propOptions[key] = createMethods(key); });
    Object.defineProperties(this, propOptions);
  }

  get id() { return [`${this._page.id}`, `next[${this.index}]`].join('.'); }
}


class Page extends FormComponent {
  constructor(data, form) {
    super(data, form);

    if ('fields' in this._data) {
      this._fields = this._data.fields.map(fieldName => {
        return form.fields[fieldName];
      });
    }

    if ('fieldrefs' in this._data) {
      this._fieldrefs = this._data.fieldrefs.map(fieldref => {
        return form.fields[fieldref];
      });
    }

    if ('next' in this._data) {
      if (Array.isArray(this._data.next)) {
        this._next = this._data.next.map((nextPageData, idx) => {
          let option = new Next(nextPageData, this);

          option.index = idx;
          return option;
        });
      } else { // string
        this._next = [ new Next({ 'page': this._data.next }, this) ];
      }
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

  get fieldrefs() {
    return this._fieldrefs || [];
  }

  get next() { return this._next; }

  get id() { return `pages[${this.page}]`; }

  get url() { return `/forms/${this.form.name}/pages/${this.page}`; }

  get uniqueFieldrefs() {
    if (this.fieldrefs.length === 0) { return this.fieldrefs; }

    return utils.pruneFieldrefs(this._data, this.page, this.form._data);
  }

  // Methods

  update(newData) {
    // check page-level properties
    for (let prop in newData) {
      let value = newData[prop];

      // if current value !== new value, update it to the new value
      let datapoint = new Datapoint(prop, this.form);

      // update data point if value sent in is different
      if (datapoint.exists) {
        if (datapoint.value !== value) { datapoint.value = value; }
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
    let fields = data.fields;

    this._data = data;
    this.fileName = fileName;
    this._pages = {};
    this._fields = {};
    
    for (let fieldName in fields) {
      this._fields[fieldName] = this.createField(fieldName);
    }
    
    for (let key in pages) {
      let page = new Page(pages[key], form);
      
      page.page = key;
      this._pages[key] = page;
    }
  }

  get name() { return this._data.name; }

  get heading() { return this._data.heading; }

  set heading(value) { this._data.heading = value; }

  get phase() { return this._data.phase; }

  set phase(value) { this._data.phase = value; }

  get pages() {
    return this._pages;
  }

  get fields() {
    return this._fields;
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

  createField(name) {
    let fieldData;
    let fieldClass;
    let result;

    fieldData = this._data.fields[name];

    if ('fields' in fieldData) {
      result = new Fieldset(fieldData, this);
    } else {
      result = new Field(fieldData, this);
    }

    result.name = name;

    return result;
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
