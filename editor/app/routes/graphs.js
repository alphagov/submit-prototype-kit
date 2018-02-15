var graphData = require('../../lib/graph_data.js')


const graphs = {

  bind: function (router) {

    // load graph data
    graphData.init();

    router.get('/railroad', function (req, res) {
      let onSuccess = function (data) {
        let graph = data.graph;
        let links = data.links;
        let form = formsData.getForm('apply-for-a-medal');

        if (req.get('Accept') === 'application/json') {
          res.send({ 'graph': graph, 'links': links });
        } else {
          res.render('railroad', {
            'graph': graph,
            'links': links
          })
        }
      };

      let onError = function (error) {
        if (req.get('Accept') === 'application/json') {
          res.status(500).send(`{ "error": "${error.code}" }`);
        } else {
          res.status(500).send(`Error: ${error.code}`);
        }
      };

      graphData.getGraphAndLinks(onSuccess, onError);
    })

    router.get('/flowchart', function (req, res) {
      let onSuccess = function (data) {
        let graph = data.graph;
        let links = data.links;

        if (req.get('Accept') === 'application/json') {
          res.send({ 'graph': graph, 'links': links });
        } else {
          res.render('flowchart', {
            'graph': graph,
            'links': links
          })
        }
      };

      let onError = function (error) {
        if (req.get('Accept') === 'application/json') {
          res.status(500).send(`{ "error": "${error.code}" }`);
        } else {
          res.status(500).send(`Error: ${error.code}`);
        }
      };

      graphData.getGraphAndLinks(onSuccess, onError);
    })

  }

};

module.exports = graphs;
