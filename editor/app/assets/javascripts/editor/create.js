(function (window, document) {
  var specificFields = document.getElementById('specific-fields');

  var FieldSelector = function (fields) {
    var items = this.transformFields(fields);
    this.template = document.Editor.templates['govukSelectboxes'];
    this.data = {
      'params': {
        'items': items
      }
    };
    this.counter = 0;
  };
  FieldSelector.prototype.render = function () {
    var name = 'fields[' + this.counter + ']';

    this.data.params.label = 'Field';
    this.data.params.name = name;
    this.data.params.id = name;
    this.counter++;

    return nunjucks.renderString(this.template, this.data);
  };
  FieldSelector.prototype.transformFields = function (fields) {
    var order = ['radio', 'checkboxes', 'text', 'textarea', 'image', 'list', 'fieldset'];
    var result = fields.map(field => {
      return {
        'text': field.inputtype + ' | ' + field.name,
        'value': field.name
      };
    });

    result.sort((a, b) => {
      var indexA = order.indexOf(a.text.split(' | ')[0]);
      var indexB = order.indexOf(b.text.split(' | ')[0]);

      if (indexA < indexB) { return -1; }
      else if (indexA > indexB) { return 1; }
      else { return 0; }
    });
    return result;
  };

  var updateFields = function () {
    var pageType = document.getElementById('pagetype').value;
    var fieldProps = {
      'heading': {
        'label': 'Page heading',
        'template': 'govukInput'
      },
      'name': {
        'label': 'Page name (used in URLs)',
        'template': 'govukInput'
      },
      'guidance': {
        'label': 'Page guidance',
        'template': 'govukTextarea'
      },
      'detail': {
        'label': 'Page detail',
        'template': 'govukInput'
      }
    };
    var pageFields = {
      'start-page': ['heading','name', 'guidance'],
      'question': ['heading', 'name'],
      'check-your-answers': ['heading', 'name'],
      'application-complete': ['heading','name', 'guidance', 'detail'],
      'bounce': ['heading', 'name', 'guidance']
    };
    var fieldsForPage = pageFields[pageType];
    var fieldSelector = new FieldSelector(document.Editor.availableFields);

    specificFields.innerHTML = '';

    fieldsForPage.forEach(field => {
      var template = document.Editor.templates[fieldProps[field].template];
      var data = {
        'params': {
          'name': field,
          'id': field,
          'label': { 'text': fieldProps[field].label }
        }
      };
      var result = nunjucks.renderString(template, data);

      specificFields.innerHTML += result;
    });

    if (pageType === 'question') {
      specificFields.innerHTML += fieldSelector.render();
    }
  };

  // Make page name placeholder from heading field
  specificFields.addEventListener('keyup', function (evt) {
    if (evt.srcElement.id === 'heading') {
      var heading = evt.srcElement;
      var pageName = document.getElementById('name');

      if ((heading.value !== '') && (pageName.value === '')) {
        pageName.setAttribute('placeholder', heading.value.toLowerCase().replace(/\s/g, '-'));
      }
    }
  }, false);

  document.querySelectorAll('.page-type-update')[0].addEventListener('click', function (evt) {
    evt.stopPropagation();
    evt.preventDefault();

    updateFields();
  }, false);
})(window, document);
