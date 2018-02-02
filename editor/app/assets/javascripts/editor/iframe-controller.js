(function (window, document) {
  var iframe = document.getElementById('prototype');
  var Editor = document.Editor;

  var iFrameController = {
    iframeWin: iframe.contentWindow,
  
    sendToIframe: function(message) {
      this.iframeWin.postMessage(message, prototypeOrigin);
    },

    init: function() {
      // set iframe to height of editor's column
      var contentHeight = document.getElementById('content').getBoundingClientRect().height;

      iframe.style.height = contentHeight + 'px';
    }
  };

  Editor.iFrameController = iFrameController;
})(window, document);
