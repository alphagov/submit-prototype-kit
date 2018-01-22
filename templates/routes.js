var express = require('express')
var router = express.Router()

{% for page in form.pages %}

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

{%- set comma = joiner('else') -%}
{% for next in page.next %} {{ comma() }}{% if next['if'] %} if ({{ next['if'] | safe}}){% endif %} {%raw%}{{%endraw%}
    res.redirect('{{ next.page }}')
    return
  }{% endfor %}
  res.redirect('/{{ form.name }}/{{ page._next }}')
})

{% endfor %}
module.exports = router
