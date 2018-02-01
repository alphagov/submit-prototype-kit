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
    };

    Editor.postFormData(url, data, onResponse)
  };

  window.addEventListener('load', function () {

    Editor.iFrameController.init();

    document.getElementById('form').addEventListener('submit', function (evt) {
      evt.stopPropagation();
      evt.preventDefault();
      sendUpdates(this, reloadIframe);
    }, false);

  }, false);
})(document, window);
