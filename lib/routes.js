const fs = require('fs')
const path = require('path')
const express = require('express')
const router = express.Router()
const jsonfile = require('jsonfile')

const controllers = fs.readdirSync('./app/controllers').filter(f => f.match(/^[^\.].*\.js/))
var services = {}

controllers.forEach(controller => {
  var name = path.basename(controller, '.js')

  var module = require(`./controllers/${controller}`);

  services[name] = {
    'name': name,
    'href': `/${name}/`,
    'form': jsonfile.readFileSync(`./app/views/${name}/index.json`)
  };

  router.use(`/`, module)
})


router.get('/', function (req, res) {
  res.render('index', {'services': services})
})


module.exports = router
