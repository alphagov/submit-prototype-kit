(function (window, document) {
  var Editor = document.Editor;

  var postFormData = function (url, data, cb) {
    var httpRequest = new XMLHttpRequest();
    var qStr = Editor.getDataAsQueryString(data)
    var sendRequest;
    var handleResponse;


    sendRequest = function () {
      // configure request
      httpRequest.onreadystatechange = handleResponse
      httpRequest.open('POST', url, true)
      httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      httpRequest.setRequestHeader('Accept', 'application/json');

      // send first try
      httpRequest.send(qStr);
    };

    handleResponse = function () {
      if (httpRequest.readyState === XMLHttpRequest.DONE) {
        cb(httpRequest.responseText);
        complete = true;
      }
    };

    sendRequest();
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

  var getDataAsQueryString = function (data) {
    var str = [];

    for (var field in data) {
      str.push(field + '=' + encodeURIComponent(data[field]));
    }

    return str.join('&');
  };

  Editor.getFormData = getFormData;
  Editor.postFormData = postFormData;
  Editor.getDataAsQueryString = getDataAsQueryString;

})(window, document);
