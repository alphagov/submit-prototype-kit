(function(document, window) {
  var iFrameController = {
    iframeWin: document.getElementById('prototype').contentWindow,
  
    sendToIframe: function(message) {
      var prototypeOrigin = window.location.origin.replace(/:\d+$/, ':3000');

      this.iframeWin.postMessage(message, prototypeOrigin);
    },

    init: function() {
      // Any communication with the iframe on load goes here
    }
  };

  document.Editor = {};
  document.Editor.iFrameController = iFrameController;

  window.addEventListener('load', function () {
    document.Editor.iFrameController.init();
  }, false);
})(document, window)
