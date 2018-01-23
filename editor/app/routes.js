var express = require('express')
var router = express.Router()
var fs = require('fs')
var formsData = require('../lib/forms_data.js')


// load forms data
formsData.init();

// Route index page
router.get('/', function (req, res) {
  res.render('index', { "forms": formsData.getAll() })
})


// add your routes here

module.exports = router
