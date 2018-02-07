(function (document, window) {
	window.addEventListener("message", receiveMessage, false);

  function receiveMessage(event) {
    var prototypeOrigin = window.location.origin;
    var editorOrigin = window.location.origin.replace(/:\d+$/, ':3001');
    var data = event.data;
    var messageData;
    var processData;

    if (event.origin !== editorOrigin) {
      return;
    }

    // Turn data into a key|value hash
    // Note: data should be in the format of a query string
    processData = function(data) {
      var parts = data.split('&');
      var pairs = {};

      parts.forEach(function(part) {
        // get each key|value pair as an object
        var keyVal = part.split('=');
        pairs[keyVal[0]] = decodeURIComponent(keyVal[1]);
      });

      return pairs;
    };

    messageData = processData(data);

    // change URL of iframe if sent through
    if (messageData.hasOwnProperty('url')) {
      window.location = prototypeOrigin + messageData.url;
    }
  }
})(document, window)
