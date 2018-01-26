(function(document, window) {
  var iFrameController = {
    iframeWin: document.getElementById('prototype').contentWindow,
  
    sendToIframe: function(message) {
      var prototypeOrigin = window.location.origin.replace(/:\d+$/, ':3000');

      this.iframeWin.postMessage(message, prototypeOrigin);
    },

    init: function() {
      var currentFormPage = document.Editor.currentFormPage;

      this.sendToIframe('url=' + encodeURIComponent(currentFormPage));  
    }
  };

  // Assume document.Editor has been set
  document.Editor.iFrameController = iFrameController;

  window.addEventListener('load', function () {
    document.Editor.iFrameController.init();
  }, false);
})(document, window)
