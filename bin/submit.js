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


function render(templateFile, outputFile, data) {
  data.templateFile = templateFile
  data.outputFile = outputFile

  templates.render(templateFile, data, function(err, output) {

    if (err) {
      return console.error(chalk.red(err))
    }

    // normalise whitespace
    output = output.replace(/ +$/gm, '').replace(/\n\n+/g, '\n\n')

    console.log(chalk.blue('Writing: ' + outputFile))
    mkdirp.sync(path.dirname(outputFile))
    fs.writeFileSync(outputFile, output)
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
  for (let page of form.pages) {
    render(namePath(opts.templatesDir, page.pagetype, '.html'),
           namePath(viewsDir, page.name, '.html'),
           { form: form, page: page, })
  }
}


function pageName(form, i) {
    if ((i < 0) || (i >= form.pages.length)) {
      return undefined
    }
    page = form.pages[i]
    return page.page || "page" + i
}


function loadForm(path) {
  console.log(chalk.blue('Loading ' + path))
  var form = JSON.parse(fs.readFileSync(path, 'utf8'))

  // add field key to field object
  for (fieldref in form.fields) {
    form.fields[fieldref].field = fieldref
  }

  for (var p = 0; p < form.pages.length; p++) {

    var page = form.pages[p]

    // TBD: calculate fieldrefs

    // default next and previous pages
    form.pages[p].name = pageName(form, p)
    form.pages[p]._prev = pageName(form, p-1)
    form.pages[p]._next = pageName(form, p+1)
  }

  return form
}


renderForm(loadForm(argv._[0]))
