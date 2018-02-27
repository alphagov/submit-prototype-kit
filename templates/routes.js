var express = require('express')

var router = express.Router()
var validateFormResponse = require('../../lib/validate-form-response.js')
var form = {{ form | dump | safe }};

{% for name, page in form.pages %}

{%- if (page.heading|string) == (page.heading|list) %}
{% for o in page.heading %}
// {{ o.text }}
{% endfor %}
{% else %}
// {{ page.heading }}
{% endif %}

router.post('/{{ form.name }}/{{ page.name }}', function (req, res) {
	var data = req.session.data;
	console.log(req.url, data);
	var validationErrors = {};

	validateFormResponse.run('{{ page.name }}', form, data);

	if (validateFormResponse.hasErrors()) {
		let path = '{{ form.name }}/{{ page.name }}';
		res.render(path, { errors: validateFormResponse.errors() }, function (err, html) {
			res.end(html);
		});
	}
{% set comma = joiner('else') %}
{% for next in page.next %} else{% if next['if'] %} if ({{ next['if'] | safe}}){% endif %} {%raw%}{{%endraw%}
	return res.redirect('{{ next.page }}');
}{% endfor %}
});

{% endfor %}
module.exports = router;
