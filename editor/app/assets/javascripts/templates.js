(function (window, document) {

var govukInput =
`<div class="form-group">
  {% if params.label %}<label class="form-label" for="{{ params.name }}">{{ params.label.text }}</label>{% endif %}
  {% if params.hintHtml %}<span class="form-hint">{{ params.hintHtml | safe }}</span>{% endif %}
  <input type="text" class="form-control form-control-2-3" id="{{ params.id }}" name="{{ params.name }}" value="{{ params.value }}">
</div>`;

var govukTextarea =
`<div class="form-group">
  {% if params.label %}<label class="form-label" for="{{ params.name }}">{{ params.label.text }}</label>{% endif %}
  {% if params.hintHtml %}<span class="form-hint">{{ params.hintHtml | safe }}</span>{% endif %}
  <textarea class="form-control form-control-2-3" id="{{ params.id }}" name="{{ params.name }}" rows=5>{{ params.value }}Boo</textarea>
</div>`;

var govukRadios =
`<div class="form-group"
<fieldset>
  <legend>
     <h1 class="heading-medium">{{ params.legendHtml | safe }}</h1></legend>
  </legend>

{% for item in params.items %}
  <div class="multiple-choice" data-target="{{ item.fieldref }}">
    <input id="{{ item.value }}" type="radio" name="{{ params.name }}" value="{{ item.value }}">
    <label for="{{ item.value }}">{{ item.text }}</label>
  </div>

  {# TBD: GOV.UK frontend macro doesn't support embedded fields .. #}
  {% if item.fieldhtml %}
    <div class="panel panel-border-narrow js-hidden " id="{{ item.fieldref }}">
    {{ item.fieldhtml | safe }}
    </div>
  {% endif %}
{% endfor %}
</fieldset>
</div>`;

var govukCheckboxes =
`<div class="form-group"
<fieldset>
  <legend>
     <h1 class="heading-medium">{{ params.legendHtml | safe }}</h1></legend>
  </legend>

{% for item in params.items %}
  <div class="multiple-choice" data-target="{{ item.fieldref }}">
    <input id="{{ item.value }}" type="checkbox" name="{{ params.name }}" value="{{ item.value }}">
    <label for="{{ item.value }}">{{ item.text }}
    {%- if item.hint %} <span class="label-explanation">{{ item.hint }}</span>{%- endif -%}
    </label>
  </div>

  {# TBD: GOV.UK frontend macro doesn't support embedded fields .. #}
  {% if item.fieldhtml %}
    <div class="panel panel-border-narrow js-hidden " id="{{ item.fieldref }}">
    {{ item.fieldhtml | safe }}
    </div>
  {% endif %}

{% endfor %}
</fieldset>
</div>`;

var govukSelectboxes =
`<div class="form-group">
  <label class="form-label" for="{{ params.name }}">{{ params.label }}</label>
  <select class="form-control" id="{{ params.id }}" name="{{ params.name }}">
{% for item in params.items %}
    <option value={{ item.value }}>{{ item.text }}</option>
{% endfor %}
  </select>
</div>`;

document.Editor.templates = {
	'govukInput': govukInput,
  'govukTextarea': govukTextarea,
	'govukRadios': govukRadios,
	'govukCheckboxes': govukCheckboxes,
  'govukSelectboxes': govukSelectboxes
};

})(window, document);
