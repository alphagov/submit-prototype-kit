(function (window, document) {
  document.Editor = {};
})(window, document);
(function (window, document) {
  var Editor = document.Editor;

  var postFormData = function (url, data, onSuccess, onError) {
    var httpRequest = new XMLHttpRequest();
    var qStr = Editor.getDataAsQueryString(data)
    var sendRequest;
    var handleResponse;
    var redirect;


    redirect = function (url) {
      window.location = url;
    };

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
      var newPageURL = url.replace(/create$/, data.name);

      if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
          // create page POSTs return a redirect which the browser turns into a GET for the new HTML page so redirect to it
          if (httpRequest.getResponseHeader('content-type').split('; ')[0] === 'text/html') {
            redirect(newPageURL);
          } else {
            onSuccess(httpRequest.responseText);
          }
        }
        if (httpRequest.status === 400) {
          onError(httpRequest.responseText);
        }
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
      else { // field value is empty

        // if page name is empty, use suggested value in placeholder
        var placeholder = fields[idx].getAttribute('placeholder');
        if ((fields[idx].name === 'name') && placeholder) {
          values[fields[idx].name] = placeholder;
        }
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
(function (document, window) {
	var status = {
		show: function () {
			var classes = this.elm.className.split(' ');
			
			classes.splice(classes.indexOf('status-hidden'), 1);
			this.elm.className = classes.join(' ');

			return this;
		},
		hide: function (error) {
			var classes = this.elm.className.split(' ');
			
      if (error) {
        classes.push('status-error');
      } else {
        classes.push('status-hidden');
      }
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

	document.Editor.status = status;

})(document, window);
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
