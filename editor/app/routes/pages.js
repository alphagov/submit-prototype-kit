var jsonResponse;
({ jsonResponse } = require('./responses.js'));


const processArrayParams = function (data, keyPrefix) {
  let arrayForKey = [];
  let regExp = new RegExp(`^${keyPrefix}\\[(\\d+)\\]`);

  for (let param in data) {
    let match = param.match(regExp);

    if (match) {
      arrayForKey[match[1]] = data[param];
      delete data[match[0]];
    }
  }

  data[keyPrefix] = arrayForKey;
};

const pages = {

	bind: function (router, formsData) {

		router.get('/forms/:formname/pages/create', function (req, res) {
      let form = formsData.getForm(req.params.formname);

			res.render('create-page', {
        'form': form
			})
		});

		router.post('/forms/:formname/pages/create', function (req, res) {
			let form = formsData.getForm(req.params.formname)
			let page;

			let onSaved = function (error) {
				if (error !== undefined) {
					res.status(400).send({ 'error': result.error.message });
				}
				else {
					res.set('Location', `/forms/${form.name}/pages/${page.page}`);
					res.status(302).send();
				}
			};

			// merge fields params into a single array param
			processArrayParams(req.body, 'fields');

			let result = form.addPage(req.body);
			page = form.page(result.page);

			if (result.status === "error") {
				res.status(400).send({ 'error': result.error.message });
			}
			else {
				formsData.save(form, onSaved);
			}
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

		router.post('/forms/:formname/pages/:pagename', function (req, res) {
			let form = formsData.getForm(req.params.formname)
			let page = form.page(req.params.pagename);

      jsonResponse(res, req, form, formsData, page);
		});

	}

};

module.exports = pages;
