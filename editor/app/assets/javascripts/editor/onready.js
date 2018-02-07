(function(document, window) {
  var editorOrigin = window.location.origin
  var prototypeOrigin = editorOrigin.replace(/:\d+$/, ':3000');
  var Editor = document.Editor;
  var reloadIframe;

  var reloadIframe = function () {
    var iframe = document.getElementById('prototype');

    iframe.src = iframe.src;
  };

  var sendUpdates = function (form, cb) {
    var data = Editor.getFormData(form);
    var url = window.location.href;

    var onResponse = function (message) {
      console.log(message);
      cb();
      Editor.status
        .set('Done')
        .hide();
    };

    Editor.postFormData(url, data, onResponse)
    Editor.status
      .show()
      .set('Updating JSON');
  };

  Editor.status.init();

  window.addEventListener('load', function () {

    Editor.iFrameController.init();

    var form = document.getElementById('form');

    if (form) {
      form.addEventListener('submit', function (evt) {
        evt.stopPropagation();
        evt.preventDefault();
        sendUpdates(this, reloadIframe);
      }, false);
    }

  }, false);
})(document, window);
