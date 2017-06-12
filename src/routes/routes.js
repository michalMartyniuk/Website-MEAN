const express = require('express')
const router = express.Router()
const User = require('../models/user')
const passport = require('passport')
const jwt = require('jsonwebtoken')

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
	if(!req.session.user) {
		return res.status(401).send("Error 401")
	}

	res.render('profile', { title: 'Profile' } )
})


router.get('/session', function (req, res, next) {
	res.send(req.session)
})

router.get('/login', function (req, res, next) {
	res.render('login', { title: 'Login' })
})


router.post('/login', function (req, res, next) {
	var username = req.body.username
	var password = req.body.password

	User.findOne({ username: username, password: password }, function (err, user) {
		if(err) {
			return res.status(500).send()
		}
		if(!user) {
			return res.status(404).send()
		}

		req.session.user = user
		res.render('profile', {
			title: 'Profile',
			name: req.session.user.name,
			username: req.session.user.username,
			email: req.session.user.email
		})
	})
})

router.get('/logout', function (req, res, next) {
	req.session.destroy()
	res.render('home', { 
		title: 'Home',
		msg: 'You have been log out successfully'
	})
})

router.get('/register', function (req, res, next) {
	res.render('register', { title: 'Sign up' })
})

router.post('/register', function (req, res, next) {

	var newUser = new User({
		name: req.body.name,
		email: req.body.email,
		username: req.body.username,
		password: req.body.password
	})


	newUser.save(function (err, savedUser) {
		if(err) {
			return res.status(500).send()
		}

		res.render('profile', { 
			title: 'Profile',
			username: savedUser.username,
			email: savedUser.email,
			name: savedUser.name
		})
	})








	// User.addUser(newUser, (err, user) => {
	// 	if(err) {
	// 		res.json({success: false, msg: "Failed to register user"})
	// 	}
	// 	else {
	// 		res.json({success: true, msg: "User registered"})
	// 	}
	// })
	
})


module.exports = router