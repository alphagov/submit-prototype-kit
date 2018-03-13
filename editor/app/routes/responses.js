var formsData = require('../../lib/forms_data.js');


const responses = {

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
