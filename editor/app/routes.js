var express = require('express')
var router = express.Router()
var fs = require('fs')
var formsData = require('../lib/forms_data.js')


// load forms data
formsData.init();

// GET routes
router.get('/', function (req, res) {
  res.render('index', {
    'forms': formsData.getAll(),
    'currentFormPage': '/'
  })
})

router.get('/forms', function (req, res) {
  res.redirect('/');
});

router.get('/forms/:formname', function (req, res) {
  res.render('form', {
    'form': formsData.getForm(req.params.formname),
    'currentFormPage': '/'  
  })
});

router.get('/forms/:formname/pages', function (req, res) {
  let page = formsData.getForm(req.params.formname).pages[0];
  let data = {
    'page': page,
    'formname': req.params.formname,
    'message': req.query.message,
    'currentFormPage': `${req.params.formname}`
  };

  res.render('page', data)
});

router.get('/forms/:formname/pages/:pagename', function (req, res) {
  let page = formsData.getForm(req.params.formname).page(req.params.pagename);
  // if index page, rewrite prototype URL to remove page name
  let pageName = (page.page == 'index') ? '' : page.page;

  res.render('page', {
    'page': page,
    'formname': req.params.formname,
    'message': req.query.message,
    'currentFormPage': `${req.params.formname}/${pageName}`
  })
});

// POST routes

let htmlResponse = function (res, req) {
  let form = formsData.getForm(req.params.formname)
  let page = form.page(req.params.pagename);
  let message = "Form data saved";

  let onSaved = function (error) {
    if (error !== undefined) { message = "Form data saved"; }

    res.redirect(`${page.url}?message=${encodeURIComponent(message)}`);
  };

  page.update(req.body);
  formsData.save(form, onSaved);
};

let jsonResponse = function (res, req) {
  let form = formsData.getForm(req.params.formname)
  let page = form.page(req.params.pagename);
  let message = "Form data saved";

  let onSaved = function (error) {
    if (error !== undefined) {
      message = `Error saving form data: ${error}`;
    }
    res.send(message);  
  };

  page.update(req.body);
  formsData.save(form, onSaved);
};

router.post('/forms/:formname/pages/:pagename', function (req, res) {
  if (req.get('Accept') === 'application/json') {
    jsonResponse(res, req);
  } else {
    htmlResponse(res, req);
  }
});
module.exports = router
