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
  res.redirect(`/forms/${formname}`);
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

let htmlResponse = function (res, req, form, page) {
  let message = "Form data saved";
  let redirectURL = (page !== undefined) ? page.url : form.url;

  let onSaved = function (error) {
    if (error !== undefined) { message = "Form data saved"; }

    res.redirect(`${redirectURL}?message=${encodeURIComponent(message)}`);
  };

  if (page !== undefined) { page.update(req.body) } else { form.update(req.body) }
  formsData.save(form, onSaved);
};

let jsonResponse = function (res, req, form, page) {
  let message = "Form data saved";

  let onSaved = function (error) {
    if (error !== undefined) {
      message = `Error saving form data: ${error}`;
    }
    res.send(message);  
  };

  if (page !== undefined) { page.update(req.body) } else { form.update(req.body) }
  formsData.save(form, onSaved);
};

router.post('/forms/:formname', function (req, res) {
  let form = formsData.getForm(req.params.formname)

  if (req.get('Accept') === 'application/json') {
    jsonResponse(res, req, form);
  } else {
    htmlResponse(res, req, form);
  }
});

router.post('/forms/:formname/pages/:pagename', function (req, res) {
  let form = formsData.getForm(req.params.formname)
  let page = form.page(req.params.pagename);

  if (req.get('Accept') === 'application/json') {
    jsonResponse(res, req, form, page);
  } else {
    htmlResponse(res, req, form, page);
  }
});
module.exports = router
