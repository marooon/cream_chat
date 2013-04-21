/* server */

var express = require('express')
  , fs = require('fs')
  , passport = require('passport')

// LOAD CONFIG
var env = process.env.NODE_ENV || 'development'
  , config = require('./config/config')[env]
  , auth = require('./config/middlewares/authorization')
  , mongoose = require('mongoose')

// DB CONNECTION
mongoose.connect(config.db)

// LOAD MODELS
var models_dir = __dirname + '/app/models'
fs.readdirSync(models_dir).forEach(function (file) {
  require(models_dir+'/'+file)
})

// AUTH CONFIG
require('./config/passport')(passport, config)

var app = express()
// EXPRESS SETTING
require('./config/express')(app, config, passport)
// ROUTES
require('./config/routes')(app, passport, auth)

// Start the app by listening on port
var port = process.env.PORT || 1337
app.listen(port)
console.log('Express app started on port '+port)
