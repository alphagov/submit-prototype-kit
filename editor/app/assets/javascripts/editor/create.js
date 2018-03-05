(function (window, document) {
  var heading = document.getElementById('heading');
  var pageName = document.getElementById('page');
  var fields = document.getElementById('specific-fields');
  var pageSelector = document.getElementById('page-selector');

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

    fields.innerHTML = '';

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

      fields.innerHTML += result;
    });
  };

  // Make page name placeholder from heading field
  if (heading && pageName) {
    heading.addEventListener('keyup', function (evt) {
      if ((heading.value !== '') && (pageName.value === '')) {
        pageName.setAttribute('placeholder', heading.value.toLowerCase().replace(/\s/g, '-'));
      }
    }, false);
  }

  pageSelector.querySelectorAll('button')[0].addEventListener('click', function (evt) {
    evt.stopPropagation();
    evt.preventDefault();

    updateFields();
  }, false);
})(window, document);
