var formsData = require('../../lib/forms_data.js')


const gets = {

	bind: function (router) {

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

		router.get('/forms/:formname/pages/create', function (req, res) {
      let form = formsData.getForm(req.params.formname);

			res.render('create-page', {
        'form': form
			})
		});

		router.get('/forms/:formname/pages/:pagename', function (req, res) {
      let form = formsData.getForm(req.params.formname);
      let page = form.page(req.params.pagename);
      // if index page, rewrite prototype URL to remove page name
      let pageName = (page.page == 'index') ? '' : page.page;

			res.render('page', {
				'page': page,
        'form': form,
				'message': req.query.message,
				'currentFormPage': `${form.name}/${pageName}`
			})
		});

	}

};

module.exports = gets;
