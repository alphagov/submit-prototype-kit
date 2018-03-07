#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const ajv = new Ajv();

function validate(datafile, schemafile) {
  const opts = { 'encoding': 'utf8' };
  const datastr = fs.readFileSync(datafile, opts); 
  const schemastr = fs.readFileSync(schemafile, opts);

  let valid = ajv.validate(JSON.parse(schemastr), JSON.parse(datastr));
  if (!valid) {
    process.stderr.write(`${ajv.errorsText()}\n`);
    process.exit(1);
  }
  else {
    process.exit();  
  }
};

const argv = require('yargs')
            .usage('Usage: validate.py [-h] [-f] <file> [-s] <schema>')
            .example('$0 -f examples/apply-for-a-medal.json -s schemas/form.json', 'Validate the given JSON file against the given schema.')
            .option('file', {
              'alias': 'f',
              'string': true,
              'requiresArg': true,
              'nargs': 1,
              'describe': 'JSON file to validate.'
            })
            .option('schema', {
              'alias': 's',
              'string': true,
              'requiresArg': true,
              'nargs': 1,
              'describe': 'JSON Schema file to validate against'
            })
            .demandOption(['file', 'schema'], 'Please provide a JSON file to validated and a JSON Schema file to validate against.')
            .help()
            .alias('help', 'h')
            .argv

datafile = argv.file;
schemafile = argv.schema;

validate(datafile, schemafile);
