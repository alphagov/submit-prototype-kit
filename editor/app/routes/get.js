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

	}

};

module.exports = gets;
