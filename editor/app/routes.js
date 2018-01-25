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
  let data = {
    'page': formsData.getForm(req.params.formname).pages[0],
    'formname': req.params.formname,
    'message': req.query.message
  };

  res.render('page', data)
});

router.get('/forms/:formname/pages/:pagename', function (req, res) {
  res.render('page', {
    'page': formsData.getForm(req.params.formname).page(req.params.pagename),
    'formname': req.params.formname,
    'message': req.query.message
  })
});

// POST routes

router.post('/forms/:formname/pages/:pagename', function (req, res) {
  let form = formsData.getForm(req.params.formname)
  let page = form.page(req.params.pagename);
  let result;
  let message;

  for (let prop in req.body) {
    if (page[prop]) {
      page[prop] = req.body[prop];
    }  
  }

  // update the JSON data and rebuild the app
  result = form.save();

  if (result.success) {
    message = "Page updated successfully.";
  } else {
    message = `Error thrown from update: '${result.error}'`;
  }
  res.redirect(`${page.url.get}?message=${encodeURIComponent(message)}`);
});
module.exports = router
