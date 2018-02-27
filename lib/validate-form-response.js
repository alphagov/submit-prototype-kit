const errors = {};

const validateFormResponse = {
	run(pageName, form, data) {
		this.data = data;
		for (const fieldName of form.pages[pageName].fields) {
			if (form.fields[fieldName].validations) {
				for (const validation of form.fields[fieldName].validations) {
					switch (validation) {
						case 'required':
							this.required(fieldName);
							break;
						default:
					}
				}
			}
		}
	},

	hasErrors() {
		return (Object.keys(errors).length > 0);
	},

	errors() {
		return errors;
	},

	required(fieldName) {
		if (this.data[fieldName] === '') {
			errors[fieldName] = 'This field is required';
		} else {
			delete errors[fieldName];
		}
	}
};

module.exports = validateFormResponse;
