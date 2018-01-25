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

router.get('/forms/:formname', function (req, res) {
  res.render('form', { 'form': formsData.getForm(req.params.formname) })
});

router.get('/forms/:formname/pages', function (req, res) {
  res.render('page', { 'page': formsData.getForm(req.params.formname).pages[0] })
});

router.get('/forms/:name/pages/:page', function (req, res) {
  res.render('page', { 'page': formsData.getForm(req.params.formname).page(req.params.pagename) })
});
module.exports = router
