function logFieldrefs(page, pageName, form) {
  var log = {};
  var checkFields;
  var checkField;
  var checkFieldRefs;
  var addToLog;

  addToLog = function(fieldName, parentName) {
    if (fieldName in log) {
      log[fieldName].push(parentName);
    }
  };

  checkField = function(field, fieldName) {
    if ('fields' in field) {
      checkFields(field.fields, fieldName);
    }
    if ('items' in field) {
      checkFieldItems(field.items, fieldName);
    }
  };

  checkFields = function(fields, parentName) {
    fields.forEach(fieldName => {
      var field = form.fields[fieldName];

      addToLog(fieldName, parentName);

      checkField(field, fieldName);
    });
  };

  checkFieldItems = function(items, fieldName) {
    items.forEach((item, idx) => {
      var fieldref, referencedField;

      if ('fieldref' in item) {

        fieldref = item.fieldref
        referencedField = form.fields[fieldref];

        addToLog(fieldref, fieldName);

        if ('fields' in referencedField) {
          checkFields(referencedField.fields, fieldref);
        }
      }
      
    });
  };

  // create a log entry for each fieldref
  page.fieldrefs.forEach(fieldref => {
    log[fieldref] = [];
  });

  // check the page fields, and all their descendent fields.
  // log every use of a referenced field against the fieldset it is in.
  page.fields.forEach(name => {
    checkField(form.fields[name], name);
  });

  return log;
};


function makeFieldrefsUnique(pageFieldrefLogs, form) {
  let formFieldrefLog = {};
  let updateFields;
  let updateItems;
  let updateFieldrefs;
  let getNewName;
  let addRefererToFormLog;
  let addNewFields;

  updateFields = function(oldref, newref, fields) {
    fields.splice(fields.indexOf(oldref), 1, newref);
  };


  updateItems = function(oldref, newref, items) {
    items.forEach(item => {
      if (items.fieldref === oldref) {
        items.fieldref = newref;
      }
    });
  };


  getNewName = function(fieldName, refererName) {
    return refererName + (fieldName[0].toUpperCase() + fieldName.substring(1));
  };


  updateFieldrefs = function(fieldName, referers, fieldrefs) {
    let oldrefs = [];

    referers.forEach(refererName => {
      let newName = getNewName(fieldName, refererName);

      // add new name to page.fieldrefs
      if ('fields' in form.fields[fieldName]) {
        fieldrefs.push(newName);
      }
      else { // fields need to be declared before fieldsets so go at the front
        fieldrefs.unshift(newName);
      }

      // store old ref for later deletion
      if (oldrefs.indexOf(fieldName) === -1) { oldrefs.push(fieldName); }
    });

    oldrefs.forEach(oldref => {
      // remove original name from fieldrefs
      fieldrefs.splice(fieldrefs.indexOf(oldref), 1);
    });

    return fieldrefs;
  };


  addReferersToFormLog = function(fieldref, referers) {
    if (!(fieldref in formFieldrefLog)) {
      formFieldrefLog[fieldref] = referers;
    }
    else {
      referers.forEach(referer => {
        if (formFieldrefLog[fieldref].indexOf(referer) === -1) {
          formFieldrefLog[fieldref].push(referer);
        }
      });
    }
  };


  addNewFields = function(formFieldrefLog) {
    for (fieldName in formFieldrefLog) {
      let referers = formFieldrefLog[fieldName];
      
      referers.forEach(referer => {
        // make new field for that name
        let newName = getNewName(fieldName, referer);
        let newField = Object.assign({}, form.fields[fieldName]);

        newField.field = newName;
        form.fields[newName] = newField;

        // update all existing references to the field in referer
        let refererField = form.fields[referer];

        if ('fields' in refererField) {
          updateFields(fieldName, newName, refererField.fields);
        }
        if ('items' in refererField) {
          updateItems(fieldName, newName, refererField.items);
        }
      });
    }
  };


  // update the fieldrefs for each page
  for (let pageName in pageFieldrefLogs) {
    let pageFieldrefLog = pageFieldrefLogs[pageName];
    let page = form.pages[pageName];

    for (let fieldref in pageFieldrefLog) {
      let referers = pageFieldrefLog[fieldref];

      if (referers.length > 1) {
        page.fieldrefs = updateFieldrefs(fieldref, referers, page.fieldrefs);

        // add any new referers to formFieldrefLog
        addReferersToFormLog(fieldref, referers);
      }
    }

  }

  // add any fields now referenced and update their references
  addNewFields(formFieldrefLog);
};


function pruneFieldrefs(page, pageName, form) {
  let log = logFieldrefs(page, pageName, form); 
  let fieldrefs = page.fieldrefs;
  let uniquerefs = fieldrefs.slice();

  fieldrefs.forEach(fieldName => {
    let fieldReferenced = false;
    let duplicates = [];
    let referers;
    
    if (fieldName in log) {
      referers = log[fieldName];

      duplicates = referers.filter(referer => { return fieldrefs.includes(referer); });

      // field is referenced by another in fieldrefs so remove
      duplicates.forEach(duplicate => {
        if (uniquerefs.includes(duplicate)) {
          uniquerefs.splice(uniquerefs.indexOf(duplicate), 1);
        }
      });
    }
  });

  return uniquerefs;
};


module.exports = {
	'logFieldrefs': logFieldrefs,
	'makeFieldrefsUnique': makeFieldrefsUnique,
  'pruneFieldrefs': pruneFieldrefs
};
