'use strict'
var express = require('express')
var app = express()
var routes = require('./routes/routes')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var session = require('express-session')
var expressValidator = require('express-validator')
var cookieParser = require('cookie-parser')

var db = 'mongodb://localhost/blog'
mongoose.connect(db)

app.use(session({
	secret: 'secret',
	saveUninitialized: false,
	resave: false
}))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(expressValidator())
app.use(cookieParser())

app.set('view engine', 'pug')
app.set('views', __dirname + '/templates')
app.use('/', routes)
app.use(express.static(__dirname + '/public'))


app.listen(7000, function(){
	console.log('server is working on 7000 port')
})