# GOV.UK Submit Prototype Kit

An alpha toolkit for prototyping services.

This version uses a JSON version of the [Submit data model](https://github.com/alphagov/submit-forms) to generate pages for the [GOV.UK Prototype Kit](https://govuk-prototype-kit.herokuapp.com/).

# Building the kit

    $ npm install

# Building the prototype

Run make to build the forms in the example directory:

    $ make

Add your own forms to the prototype by editing the Makefile, or by compiling a form manually:

    $ bin/submit.js myform.json

# Running the prototype

    $ make start
