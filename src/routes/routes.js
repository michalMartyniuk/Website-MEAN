var express = require('express')
var router = express.Router()
var User = require('../models/user')

router.get('/', function (req, res, next) {
	res.render('home', { title: 'Home' })
	next()
})

router.get('/home', function (req, res, next) {
	res.render('home', { title: 'Home' })
	next()
})

router.get('/todo', function (req, res, next) {
	res.render('todo', { title: 'To-do list' })
	next()
})

router.get('/validation', function (req, res, next) {
	res.render('validation', { title: 'Form Validation', success: req.session.success, errors: req.session.errors})
	req.session.errors = null
})

router.post('/validation', function (req, res, next) {
	req.check('email', 'Invalid email address').isEmail()
	// req.check('password', 'Password is invalid').isLength({min:4})

	var errors = req.validationErrors()
	if(errors) {
		req.session.errors = errors
		req.session.success = false
		res.send(errors)
	}
	else {
		req.session.success = true
	}
	res.redirect('/validation')
})

router.get('/blog', function (req, res, next) {
	res.render('blog', { title: 'Blog' })
	next()
})

router.get('/profile', function (req, res, next) {
	res.render('profile', { title: 'Profile' } )
})

router.get('/register', function (req, res, next) {
	res.render('register', { title: 'Sign up' })
})

router.get('/session', function (req, res, next) {
	res.send(req.session)
})

router.post('/register', function (req, res, next) {
	
	req.checkBody('name', 'Name is required').notEmpty()
	req.checkBody('email', 'Email is required').notEmpty()
	req.checkBody('email', 'Email is not valid').isEmail()

	var errors = req.validationErrors()

	if(errors) {
		res.render('register', { errors: errors })
	}
	else {
		res.send('All is good')
		next()
	}

	// var newUser = new User()

	// newUser.username = req.body.username
	// newUser.email = req.body.email

	// newUser.save(function (err, data) {
	// 	if(err){
	// 		console.log(err)
	// 		res.send(err)
	// 	}
	// 	else {
	// 		res.render('profile', { username: data.username, email: data.email, title: 'Profile' })
	// 	}
	// })
})


module.exports = router