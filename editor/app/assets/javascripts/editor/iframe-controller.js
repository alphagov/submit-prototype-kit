(function (window, document) {
  var iframe = document.getElementById('prototype');
  var Editor = document.Editor;

  var iFrameController = {
    iframeWin: iframe.contentWindow,
  
    sendToIframe: function(message) {
      this.iframeWin.postMessage(message, prototypeOrigin);
    },

    init: function() {
      // Any communication with the iframe on load goes here
    }
  };

  Editor.iFrameController = iFrameController;
})(window, document);
