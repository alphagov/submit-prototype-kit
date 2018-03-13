var htmlResponse;
var jsonResponse;
({ jsonResponse, htmlResponse } = require('./responses.js'));


const forms = {

  bind: function (router, formsData) {

    router.get('/forms', function (req, res) {
      res.redirect('/');
    });

    router.get('/forms/:formname', function (req, res) {
      let form = formsData.getForm(req.params.formname);

      res.render('form', {
        'form': form,
        'currentFormPage': `/${form.name}`  
      })
    });

    router.post('/forms/:formname', function (req, res) {
      let form = formsData.getForm(req.params.formname)

      if (req.get('Accept') === 'application/json') {
        jsonResponse(res, req, form, formsData);
      } else {
        htmlResponse(res, req, form, formsData);
      }
    });

    router.get('/forms/:formname/pages', function (req, res) {
      res.redirect(`/forms/${formname}`);
    });

  }

};

module.exports = forms;
