(function (document, window) {

  var graph = document.Editor.railroad.graph;
  var canvas = document.getElementById('canvas');
  var page = graph['index'];
  var processPage;
  
  processPage = function (key) {
    var children = graph[key];
    var index = Math.floor(children.length / 2) - 1
    var args = [];
    var tree;

    if (children.length) {

      // just 1 child means the rail is a sequence of this page and the next
      if (children.length === 1) {

        return Sequence(NonTerminal(key), processPage(children[0]));

      } else { // more than 1 child so second item in sequence is a choice

        // build up arguments for Choice
        args.push(index);
        children.forEach(function (child) {
          args.push(processPage(child));
        });

        return Sequence(NonTerminal(key), Choice.apply(null, args));
      }

    } else { // no children
      return Terminal(key);
    }
  };

  canvas.innerHTML = '';
  Diagram(processPage('index'))
    .format(40, 40, 40, 40)
    .addTo(canvas);

})(document, window);
