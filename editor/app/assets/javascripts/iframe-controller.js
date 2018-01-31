(function(document, window) {
  var iframe = document.getElementById('prototype');
  var editorOrigin = window.location.origin
  var prototypeOrigin = editorOrigin.replace(/:\d+$/, ':3000');

  var iFrameController = {
    iframeWin: iframe.contentWindow,
  
    sendToIframe: function(message) {
      this.iframeWin.postMessage(message, prototypeOrigin);
    },

    init: function() {
      // Any communication with the iframe on load goes here
    }
  };

  var getFormData = function (form) {
    var fields = form.querySelectorAll('input, select, textarea');
    var values = {};
    var getValueFromField;
    var fieldValue;

    getValueFromField = function (elm) {
      var type = elm.nodeName.toLowerCase();

      if ((type === 'input') && (elm.type !== 'submit')) {
        return elm.value;
      }
      if (type === 'select') {
        return elm.options[elm.selectedIndex].value;
      }
      if (type === 'textarea') {
        return elm.value;
      }
      return null;
    };

    for (var idx = 0; idx < fields.length; idx++) {
      fieldValue = getValueFromField(fields[idx]);

      if (fieldValue) {
        values[fields[idx].name] = fieldValue;
      }
    }

    return values;
  };

  var stringifyData = function (data) {
    var str = [];

    for (var field in data) {
      str.push(field + '=' + encodeURIComponent(data[field]));
    }

    return str.join('&');
  };

  var update = function (url, data, cb) {
    var httpRequest = new XMLHttpRequest();
    var sendRequest;
    var handleResponse;


    sendRequest = function () {
      // configure request
      httpRequest.onreadystatechange = handleResponse
      httpRequest.open('POST', url, true)
      httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      httpRequest.setRequestHeader('Accept', 'application/json');

      // send first try
      httpRequest.send(stringifyData(data));
    };

    handleResponse = function () {
      if (httpRequest.readyState === XMLHttpRequest.DONE) {
        cb(httpRequest.responseText);
        complete = true;
      }
    };

    sendRequest();
  };

  var sendUpdates = function (form) {
    var data = getFormData(form);

    var onResponse = function (message) {
      console.log(message);
    };

    update(window.location.href, data, onResponse)
  };

  document.Editor = {};
  document.Editor.iFrameController = iFrameController;

  window.addEventListener('load', function () {

    document.Editor.iFrameController.init();
    document.getElementById('form').addEventListener('submit', function (evt) {
      evt.stopPropagation();
      evt.preventDefault();
      sendUpdates(this);
    }, false);

  }, false);
})(document, window)
