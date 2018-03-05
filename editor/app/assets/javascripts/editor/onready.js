(function(document, window) {
  var editorOrigin = window.location.origin
  var prototypeOrigin = editorOrigin.replace(/:\d+$/, ':3000');
  var Editor = document.Editor;
  var reloadIframe;

  var reloadIframe = function () {
    var iframe = document.getElementById('prototype');

    iframe.src = iframe.src;
  };

  var sendFormData = function (form, startMessage, cb) {
    var data = Editor.getFormData(form);
    var url = window.location.href;

    var redirect = function (url) {
      window.location = url;
    };

    var onError = function (response) {
      var response = JSON.parse(response);
      console.log("Error: '" + response.error + "'");
      Editor.status
        .set(response.error)
        .hide(true);
    };

    var onSuccess = function(response) {
      var response = JSON.parse(response);
      console.log(response);
      cb(response);
      Editor.status
        .set(response.message)
        .hide();
    };

    Editor.postFormData(url, data, onSuccess, onError, redirect)
    Editor.status
      .show()
      .set(startMessage);
  };

  Editor.status.init();

  window.addEventListener('load', function () {

    Editor.iFrameController.init();

    var form = document.getElementById('form');

    if (form) {
      form.addEventListener('submit', function (evt) {
        evt.stopPropagation();
        evt.preventDefault();
        sendFormData(this, 'Updating JSON', reloadIframe);
      }, false);
    }

  }, false);
})(document, window);
