# Runner

## Overview

The runner prototype is an app generator which takes one or many JSON form descriptions and uses the [GOVUK Prototype kit](https://github.com/alphagov/govuk_prototype_kit) to build an [ExpressJS](https://expressjs.com/) app.

## Usage

### Building the prototype

Run make to build the forms in the example directory:

    $ make

Add your own forms to the prototype by editing the Makefile, or by compiling a form manually:

    $ bin/submit.js myform.json

### Running the prototype

    $ make start

This boots the prototype and is viewable on [http://localhost:3000](http://localhost:3000)

### Directory structure

| File | Description |
| ---- | ----------- |
| `./bin/submit.js` | Command line tool to generate runner app, called with path to the form definition. |
| `./templates/routes.js` | Express routes template, one POST route is generated for each step in the form. |
| `./templates/application-complete.html` <br> `./templates/bounce.html` <br> `./templates/check-your-answers.html` <br> `./templates/interruption.html` <br> `./templates/start-page.html` <br> `./templates/question.html` | Nunjucks template files, each file maps to a page type. |
| `./templates/diagram.html` | Nunjucks template for diagram page. |
| `./templates/submit_layout.html` | Layout file for template pages |
| `./templates/submit_macros.ntk` <br> `./templates/frontend_macros.ntk` | Library of Nunjucks macros used in template pages. |

### Flowchart

Each form in the app has a page showing the form as a flowchart.

The URL for the flowchart page follows this format:

`http://localhost:3000/{name of form}/diagram`, for example:
`http://localhost:3000/apply-for-a-medal/diagram`.
