var formsData = require('../../lib/forms_data.js');


const responses = {

	htmlResponse: function (res, req, form, formsData, page) {
		let message = "Form data saved";
		let redirectURL = (page !== undefined) ? page.url : form.url;

		let onSaved = function (error) {
			if (error !== undefined) { message = "Form data saved"; }

			res.redirect(`${redirectURL}?message=${encodeURIComponent(message)}`);
		};

		if (page !== undefined) { page.update(req.body) } else { form.update(req.body) }
		formsData.save(form, onSaved);
	},

	jsonResponse: function (res, req, form, formsData, page) {
		let message = "Form data saved";

		let onSaved = function (error) {
			if (error !== undefined) {
				message = `Error saving form data: ${error}`;
			}
			res.send(message);  
		};

		if (page !== undefined) { page.update(req.body) } else { form.update(req.body) }
		formsData.save(form, onSaved);
	}

};

module.exports = responses;
