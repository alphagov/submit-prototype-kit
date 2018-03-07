# Submit Form JSON spec

A JSON Schema spec, [form.json](form.json) is the base document.

## Data Model

A Form contains Fields, Pages and its own attributes.

### Forms

<table>
<thead>
<tr>
<th width="15%">attribute</th>
<th width="30%">type</th>
<th width="50%">description</th>
</tr>
</thead>
<tr>
  <td>name</td>
  <td>string</td>
  <td>name of the form, lowercase with hyphens for spaces.

For use in URLs.</td>
</tr>
<tr>
  <td>heading</td>
  <td>String</td>
  <td>Human-readable name of the form.

For use on the start page of a form and in the titles of form pages.</td>
</tr>
<tr>
  <td>phase</td>
  <td>

Enumerable, one of:
* alpha
* beta
* live

</td>
  <td>

Stage of development the form is in, based on those listed in the [service manual](https://www.gov.uk/service-manual/agile-delivery#phases-of-an-agile-project)</td>
</tr>
<tr>
  <td>organisations</td>
  <td>

Array of [Organisations](#organisations)
</td>
  <td>List of organisations the form is associated with.</td>
</tr>
<tr>
  <td>pages</td>
  <td>

Object of [Pages](#pages)

The mapping is:

`"name_of_page": Page`

</td>
  <td>Collection of pages in the form.</td>
</tr>
<tr>
  <td>fields</td>
  <td>

Object of [Fields](#fields)

The mapping is:

`"name_of_field": Field`

</td>
  <td>Collection of fields used throughout the form.</td>
</tr>
</table>


## Organisations

<table>
<thead>
<tr>
<th width="15%">attribute</th>
<th width="30%">type</th>
<th width="50%">description</th>
</tr>
</thead>
<tr>
  <td>name</td>
  <td>String</td>
  <td>Human-readable name of the department.</td>
</tr>
<tr>
  <td>organisation</td>
  <td>String in the form:

`register:record_id`

</td>
  <td>

Name of the [Government organisations register](https://registers.cloudapps.digital/registers/government-organisation) and the id of the record for this organisation.</td>
</tr>
<tr>
  <td>website</td>
  <td>String</td>
  <td>URL for the homepage of the organisation's website.</td>
</tr>
</table>


## Fields

<table>
<thead>
<tr>
<th width="15%">attribute</th>
<th width="30%">type</th>
<th width="50%">description</th>
</tr>
</thead>
<tr>
  <td>inputtype</td>
  <td>

Enumerable, one of:
* radio
* checkboxes
* text
* textarea
* list
* image
* fieldset

</td>
  <td>The type of field.

If the value is `fieldset`, the field is a collection of other fields.</td>
</tr>
<tr>
  <td>legend</td>
  <td>String</td>
  <td>Label for a group of fields.

Used if inputype is `fieldset`</td>
</tr>
<tr>
  <td>label</td>
  <td>String</td>
  <td>Label for an single field.</td>
</tr>
<tr>
  <td>hint</td>
  <td>String</td>
  <td>Text that appears below the label for a single field.

Used for information that helps users understand what to enter.</td>
</tr>
<tr>
  <td>datatype</td>
  <td>String</td>
  <td>Type of data the field represents.</td>
</tr>
<tr>
  <td>fields</td>
  <td>Array of Strings</td>
  <td>

List of fields to include in the fieldset if inputtype is `fieldset`.</td>
</tr>
<tr>
  <td>items</td>
  <td>

Array of [Items](#items)

  </td>
  <td>

List of items used in multiple-choice fields, for example `yes` and `no` options in a `radio` field.</td>
</tr>
</table>


## Items

<table>
<thead>
<tr>
<th width="15%">attribute</th>
<th width="30%">type</th>
<th width="50%">description</th>
</tr>
</thead>
<tr>
  <td>label</td>
  <td>String</td>
  <td>Label for an single field.</td>
</tr>
<tr>
  <td>hint</td>
  <td>String</td>
  <td>Text that appears below the label for a single field.

Used for information that helps users understand what to enter.</td>
</tr>
<tr>
  <td>value</td>
  <td>String</td>
  <td>Value the field will be set to if this item is selected.</td>
</tr>
<tr>
  <td>fieldref</td>
  <td>String</td>
  <td>The name of a field to display below the item.

This field will only be shown if the item above it is selected.</td>
</tr>
</table>


## Pages

<table>
<thead>
<tr>
<th width="15%">attribute</th>
<th width="30%">type</th>
<th width="50%">description</th>
</tr>
</thead>
<tr>
  <td>pagetype</td>
  <td>

Enumerable, one of:
* start-page
* question
* check-your-answers
* bounce
* application-complete

</td>
  <td>The type of page, not all page types require all fields.</td>
</tr>
<tr>
  <td>heading</td>
  <td>String</td>
  <td>Page heading</td>
</tr>
<tr>
  <td>guidance</td>
  <td>String (Markdown)</td>
  <td>Guideance to help the user answer the question(s).</td>
</tr>
<tr>
  <td>detail</td>
  <td>String (Markdown)</td>
  <td></td>
</tr>
<tr>
  <td>fields</td>
  <td>Array</td>
  <td>

List of field keys, eg `["name", "email"]`

</td>
</tr>
<tr>
  <td>fieldrefs</td>
  <td>Array</td>
  <td>List of fields which are revealed when items are selected.</td>
</tr>
<tr>
  <td>next</td>
  <td>

String or Array of [Next pages](#nexts)

</td>
  <td>

If there is only one `next` page then a string should be used.

When there are optional next pages they are evaluated in order, and the first match is linked to.
</td>
</tr>
</table>


## Nexts

Fields have the following metadata:

<table>
<thead>
<tr>
<th width="15%">attribute</th>
<th width="30%">type</th>
<th width="50%">description</th>
</tr>
</thead>
<tr>
  <td>page</td>
  <td>String</td>
  <td>

The name of the [page](#pages) to link to</td>
</tr>
<tr>
  <td>if</td>
  <td>String (optional)</td>
  <td>

The conditions which must be correct before the page is linked to. eg
`"if": "data['age'] == 16"`

When `if` isn't present then the first page in the array will be linked to.
</td>
</tr>
</table>


## Todo

* More types of validation, beyond required
* File upload field
* Link to page from Markdown
* Right column content, additional guidance or content.
* Allow next to be a URL rather than a page to allow users to go directly to another service
* Variable substitution, repeat answer back to user as part of another question or statement or interpolation on label/variable name
