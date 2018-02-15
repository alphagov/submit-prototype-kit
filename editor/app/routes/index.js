var express = require('express')
var router = express.Router()
var fs = require('fs')

var graphRoutes = require('./graphs.js')
var getRoutes = require('./get.js');
var postRoutes = require('./post.js');


// routes for GET requests
getRoutes.bind(router);

// routes for POST requests
postRoutes.bind(router);

// routes for graph views/endpoints
graphRoutes.bind(router);

module.exports = router
