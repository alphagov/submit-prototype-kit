(function (window, document) {
  var heading = document.getElementById('heading');
  var pageName = document.getElementById('page');

  if (heading && pageName) {
    heading.addEventListener('keyup', function (evt) {
      if ((heading.value !== '') && (pageName.value === '')) {
        pageName.setAttribute('placeholder', heading.value.toLowerCase().replace(/\s/g, '-'));
      }
    }, false);
  }
})(window, document);
