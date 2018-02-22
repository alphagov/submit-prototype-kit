var formsData = require('../../lib/forms_data.js')


const posts = {

	bind: function (router) {

    // load forms data
    formsData.init();

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

		router.post('/forms/:formname/pages', function (req, res) {
			let form = formsData.getForm(req.params.formname)


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

	}

};

module.exports = posts;
