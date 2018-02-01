#! /usr/bin/env node

// command to compile a prototype GOV.UK submit form

var fs = require('fs')
var path = require('path')
var nunjucks = require('nunjucks')
var markdown = require('nunjucks-markdown');
var marked = require('marked');
var mkdirp = require('mkdirp')
var chalk = require('chalk')
var glob = require("glob")
var yargs = require('yargs')
var jsonfile = require('jsonfile')


// Check if node_modules folder exists
const nodeModulesExists = fs.existsSync(path.join(process.cwd(), '/node_modules'))
if (!nodeModulesExists) {
  console.error('ERROR: Node module folder missing. Try running `npm install`')
  process.exit(0)
}

// command line
var argv = yargs
  .usage('Usage: submit form.json')
  .example('submit examples/simple.json', 'compile example simple form')
  .demand(1)
  .option('templates', {
    alias: 't',
    string: true,
    requiresArg: true,
    nargs: 1,
    describe: 'Directory where templates live'
  })
  .option('out', {
    alias: 'o',
    string: true,
    requiresArg: true,
    nargs: 1,
    describe: 'Output directory'
  })
  .help()
  .alias('help', 'h')
  .epilogue('For more information see https://github.com/alphagov/submit-prototype-kit')
  .argv


var opts = {}
opts.templatesDir = argv.templates || './templates'
opts.outputDir = argv.out || './prototype/app'


var templates = nunjucks.configure(path.resolve(process.cwd(), opts.templatesDir), {})

markdown.register(templates, marked);


function namePath(dir, name, suffix='') {
  return path.resolve(dir, name.replace(/\W/, '-') + suffix)
}


function dump(outputFile, output, writer=fs) {
  console.log(chalk.blue('Writing: ' + outputFile))
  mkdirp.sync(path.dirname(outputFile))
  writer.writeFileSync(outputFile, output)
}


function render(templateFile, outputFile, data) {
  data.templateFile = templateFile
  data.outputFile = outputFile

  templates.render(templateFile, data, function(err, output) {

    if (err) {
      return console.error(chalk.red(err))
    }

    // normalise whitespace
    output = output.replace(/ +$/gm, '').replace(/\n\n+/g, '\n\n')
    dump(outputFile, output)
  })
}


function renderForm(form) {

  var controllersDir = path.resolve(opts.outputDir, 'controllers')
  var viewsDir = namePath(path.resolve(opts.outputDir, 'views'), form.name)

  // controller
  render(namePath(opts.templatesDir, 'routes', '.js'),
         namePath(controllersDir, form.name, '.js'),
        { form: form, })

  // page view
  for (let p in form.pages) {
    page = form.pages[p]
    render(namePath(opts.templatesDir, page.pagetype, '.html'),
           namePath(viewsDir, page.name, '.html'),
           { form: form, page: page, })
  }

  // save expanded form object as JSON
  dump(namePath(viewsDir, 'index', '.json'), form, jsonfile)
}


function loadForm(path) {
  console.log(chalk.blue('Loading ' + path))
  var form = JSON.parse(fs.readFileSync(path, 'utf8'))

  // add field key to field object
  for (fieldref in form.fields) {
    form.fields[fieldref].field = fieldref
  }

  for (name in form.pages) {
    form.pages[name].name = name

    if (typeof(form.pages[name].next) === 'string') {
      form.pages[name].next = [{"page": form.pages[name].next}]
    }

    var page = form.pages[name]

    // check fields exist
    if (page.fields) {
      for (field of form.pages[name].fields) {
        if (!form.fields[field]) {
          console.log(chalk.red("unknown field", field))
        }
      }
    }

    // check fieldrefs exist
    if (page.fieldrefs) {
      for (field of form.pages[name].fieldrefs) {
        if (!form.fields[field]) {
          console.log(chalk.red("unknown field", field))
        }
      }
    }

    // check next pages exist
    if (page.next) {
      for (next of page.next) {
        if (!form.pages[next.page]) {
          console.log(chalk.red("unknown page", next.page))
        }
      }
    }

    // TBD: calculate page fieldrefs
  }

  return form
}


renderForm(loadForm(argv._[0]))
