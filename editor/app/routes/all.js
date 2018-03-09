var express = require('express');
var router = express.Router();
var fs = require('fs');

var formsData = require('../../lib/forms_data.js');

var graphRoutes = require('./graphs.js');
var indexRoutes = require('./index.js');
var pageRoutes = require('./pages.js');
var formsRoutes = require('./forms.js');

// routes for graph views/endpoints
graphRoutes.bind(router);

// load data for the form
formsData.init();

// routes for requests to the editor index
indexRoutes.bind(router, formsData);

// routes for requests to page resources
pageRoutes.bind(router, formsData);

// routes for requests to form resources
formsRoutes.bind(router, formsData);

module.exports = router;
