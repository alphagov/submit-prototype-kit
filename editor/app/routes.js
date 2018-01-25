var express = require('express')
var router = express.Router()
var fs = require('fs')
var formsData = require('../lib/forms_data.js')


// load forms data
formsData.init();

// GET routes
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
  res.render('page', {
    'page': formsData.getForm(req.params.formname).pages[0],
    'formname': req.params.formname,
    'update': req.query.update
  })
});

router.get('/forms/:formname/pages/:pagename', function (req, res) {
  res.render('page', {
    'page': formsData.getForm(req.params.formname).page(req.params.pagename),
    'formname': req.params.formname,
    'update': req.query.update
  })
});

// POST routes

router.post('/forms/:formname/pages/:pagename', function (req, res) {
  let form = formsData.getForm(req.params.formname)
  let page = form.page(req.params.pagename);

  for (let prop in req.body) {
    if (page[prop]) {
      page[prop] = req.body[prop];
    }  
  }

  res.redirect(page.url.get + '?update=true');
});
module.exports = router
