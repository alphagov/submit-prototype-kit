(function (document, window) {
  var graphData = document.Editor.flowchart.graph;
  var linksData = document.Editor.flowchart.links

  var g = new dagreD3.graphlib.Graph().setGraph({
		rankdir: "LR"
	});

  Object.keys(graphData).forEach(function (page) {
    g.setNode(page, { 'label': page });
  });

  Object.keys(linksData).forEach(function (linkStr) {
    var pages = linkStr.split(',');

    g.setEdge(pages[0], pages[1], { 'label': '' });
  });

	// Set some general styles
	g.nodes().forEach(function(v) {
		var node = g.node(v);
		node.rx = node.ry = 5;
	});

	var svg = d3.select('svg'),
			inner = d3.select('svg g');

	// Set up zoom support
	var zoom = d3.zoom().on("zoom", function() {
		inner.attr("transform", d3.event.transform);
	});
	svg.call(zoom);

	// create the renderer
	var render = new dagreD3.render();

	render(inner, g);

	// Center the graph
	var initialScale = 0.4;
	svg.call(zoom.transform, d3.zoomIdentity.translate((svg.attr("width") - g.graph().width * initialScale) / 2, 20).scale(initialScale));

	//svg.attr('height', g.graph().height * initialScale + 40);
})(document, window);
