# Editor

## Overview

The editor is an [ExpressJS](https://expressjs.com/) app.

It's built from a copy of the [GOVUK Prototype kit](https://github.com/alphagov/govuk_prototype_kit)
so gives you these features out-of-the-box:
- static asset compilation
- nunjucks templating (used by [GOVUK Frontend](https://github.com/alphagov/govuk-frontend))
- a sensible folder structure
- [GOVUK Elements](https://govuk-elements.herokuapp.com/) Sass files included
- base GOVUK layout page built on [GOVUK Template](https://github.com/alphagov/govuk_template)
  included
- app is reloaded and assets re-compiled automatically when files change

## Run the app

### Install

Use this command to install all dependencies:

`$ npm install`

Use this make command to run the editor app:

`$ make editorstart`

To run the editor app with the debugger on:

`$ make editorstart DEBUG=true`

### Run the prototype app

The editor app has the prototype app in an iframe so you'll also need to have it running.

Use this make command to run the prototype app:

`$ make start`

## App structure

The overall app structure follows the GOVUK Prototype kit. This section deals with code specific to
the editor app.

```
- editor/
  - lib/
    - forms_data.js
    - graph_data.js
    - iframe-controller-client-script-tag.html
    - iframe-controller-client.js
  - app/
    - models.js
    - routes/
      - responses.js
      - pages.js
      - forms.js
      - index.js
      - all.js
    - assets/
      - sass/
        - editor.scss
      - javascripts/
        - templates.js
        - nunjucks.js
        - editor/
          - head.js
          - utils.js
          - status.js
          - iframe-controller.js
          - onready.js
     - views/
       - form.html
       - page.html
       - create-page.html
```

## JavaScript

All JavaScript is namespaced to `window.Editor`. Code written specifically for the editor's page is
kept in `app/assets/javascripts/editor`.

## Sass/SCSS

The editor uses bits of GOVUK Elements and the GOVUK Prototype kit Sass. Sass specific to the editor
is in `editor.scss`.

## Templating 

All templates are written in [nunjucks](https://mozilla.github.io/nunjucks/). There are macros for
generating fields to enter form data in `editor/app/views/macros/fields.ntk`.

## Interfaces for forms and graph data

`editor/lib/forms_data.js` is a wrapper for interacting with the JSON data. It lets you:
- load forms data from the JSON into memory
- interact with each form's data and its component parts through instances of the models
- save all changes into the JSON

`editor/lib/graph_data.js` is a wrapper for `bin/lint.py` which allows you to work with the JSON it
outputs as JavaScript objects.

## Models

`editor/app/models.js` contains JavaScript wrapper classes for interacting with the in-memory forms
data. When instantiated with a reference to the data they return an object that can be queried or
passed to templates for rendering.

## Iframe controller client

When prototypes are built, a small JavaScript client is inserted into each page to allow the editor
control over it. It works by responding to postMessage calls from the editor JavaScript.

- `iframe-controller-client.js` is the code that gets added to prototype pages.
- `iframe-controlller-client-script-tag.html` is the script tag for it.
- `iframe-controller.js` creates `document.Editor.iframe-controller` for sending messages to the
client.

## Features

The editor is a work-in-progress and is still missing some important features.

### Completed

- view all forms in the prototype
- view all pages in a form
- edit the form properties
- edit page properties
- edit field properties
- create a new page (incomplete)

### Still needed

- flowchart view
- edit a organisations data for a form
- add/remove a field
- add new properties and fields to a page
- add/remove a form
- add/remove a page in the flowchart view
- reorder options in a field
- reorder fields in a page
- UI for adding/removing conditional fields
- edit raw JSON in the GUI
- UI that displays advanced attributes for fields (which are not available in the standard view)
- create fields and pages from existing templates
- ability to make templates
- ability to see when the values you're working with are inherited or explicit
- using user data in content
- conditional content
- form validation
- normalisation of information (input/output formats and any transformations that need to happen)
- derived data (ie age by knowing a user's date of birth)
- short names for fields
