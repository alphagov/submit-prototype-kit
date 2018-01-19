const fs = require('fs')
const path = require('path')
const express = require('express')
const router = express.Router()

const controllers = fs.readdirSync('./app/controllers').filter(f => f.match(/^[^\.].*\.js/))

controllers.forEach(controller => {
  var name = path.basename(controller, '.js')
  router.use(`/`, require(`./controllers/${controller}`))
})


router.get('/', function (req, res) {
  res.render('index')
})


module.exports = router
