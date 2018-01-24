var express = require('express')
var router = express.Router()
var fs = require('fs')
var formsData = require('../lib/forms_data.js')


// load forms data
formsData.init();

// Routes
router.get('/', function (req, res) {
  res.render('index', { "forms": formsData.getAll() })
})

router.get('/forms', function (req, res) {
  res.redirect('/');
});

router.get('/forms/:name', function (req, res) {
  let name = req.params.name;

  res.render('form', { 'form': formsData.getForm(name) })
});
module.exports = router
