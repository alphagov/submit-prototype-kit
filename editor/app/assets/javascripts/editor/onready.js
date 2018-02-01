(function(document, window) {
  var editorOrigin = window.location.origin
  var prototypeOrigin = editorOrigin.replace(/:\d+$/, ':3000');
  var Editor = document.Editor;
  var reloadIframe;

  var reloadIframe = function () {
    var iframe = document.getElementById('prototype');

    iframe.src = iframe.src;
  };

  var status = {
    show: function () {
      var classes = this.elm.className.split(' ');
      
      classes.splice(classes.indexOf('status-hidden'), 1);
      this.elm.className = classes.join(' ');

      return this;
    },
    hide: function () {
      var classes = this.elm.className.split(' ');
      
      classes.push('status-hidden');
      this.elm.className = classes.join(' ');

      return this;
    },
    set: function (message) {
      this.elmText.nodeValue = message;

      return this;
    },
    init: function () {
      this.elm = document.createElement('div');
      this.elmWrapper = document.createElement('div');
      this.elm.className = 'status';
      this.elmWrapper.className = 'status-wrapper';
      this.elm.setAttribute('role', 'region');
      this.elm.setAttribute('aria-live', 'polite');
      this.elmText = document.createTextNode('');
      this.elmWrapper.appendChild(this.elm);
      this.elm.appendChild(this.elmText);

      document.getElementsByTagName('body')[0].appendChild(this.elmWrapper);
      this.hide();

      return this;
    }
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

  status.init();

  Editor.status = status;

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
