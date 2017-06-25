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

router.get('/blog', function (req, res, next) {
	res.render('blog', { title: 'Blog' })
	next()
})

router.get('/gallery', function (req, res, next) {
	res.render('gallery', { title: 'Gallery' }) 
	next()
})


router.get('/profile', function (req, res, next) {
	if(!req.session.user) {
		var err = new Error("Sorry! You need to be logged in to see this page")
		return next(err)
	}
	res.render('profile', { title: 'Profile' })
})


router.get('/session', function (req, res, next) {
	res.send(req.session)
})

router.get('/login', function (req, res, next) {
	res.render('login', { title: 'Login' })
	next()
})


router.post('/login', function (req, res, next) {
	var username = req.body.username
	var password = req.body.password

	User.findOne({ username: username, password: password }, function (err, user) {
		if(err) {
			return next(err)
		}
		if(!user) {
			var err = new Error('User not found')
			return next(err)
		}

		req.session.user = user
		res.redirect('profile')
	})
})

router.get('/logout', function (req, res, next) {
	req.session.destroy()
	res.redirect('home')
})

router.get('/register', function (req, res, next) {
	res.render('register', { title: 'Register' })
	next() 
})

router.post('/register', function (req, res, next) {

	var newUser = new User({
		name: req.body.name,
		email: req.body.email,
		username: req.body.username,
		password: req.body.password
	})


	newUser.save(function (err, user) {
		if(err) {
			return next(err)
		}

		req.session.user = user
		res.redirect('profile')
	})	
})


router.get('/data', function (req, res, next) {
	User.findOne({ username: req.session.user.username }, function (err, data) {
		if(err) {
			return next(err)
		}
		res.json(data)
	})
})


router.post('/editTodo:task/:newTask', function (req, res, next) {
	var user = req.session.user
	var task = req.params.task
	var newTask = req.params.newTask

	User.update({username: user.username, 'tasks.inProgress': { name: task, edit: false } }, 
		{$set: {'tasks.inProgress.$': { name: newTask, edit: false } } },
		function (err, data) {
			if(err) {
				return next(err)
			}
			res.json(data)
		})
})

router.post('/doneTodo:task', function (req, res, next) {
	var user = req.session.user
	var task = req.params.task
	User.update({ username: user.username },
		{ $push: { "tasks.done": task }},
		function (err, data) {
			if(err) {
				return next(err)
			}
			res.json(data)
		})
})



router.post('/addTodo:id', function (req, res, next) {
	var user = req.session.user
	var task = req.params.id
	User.update({ username: user.username },
		{ $push: { "tasks.inProgress": { name: task, edit: false } }},
		function (err, data) {
			if(err) {
				return next(err)
			}
			res.json(data)
		})
})

router.delete('/delTodo:task', function (req, res, next) {
	var user = req.session.user
	var task = req.params.task
	User.update({ username: user.username }, 
		{ $pull: { "tasks.inProgress": { name: task, edit: false } }},
		function (err, data) {
			if(err) {
				return next(err)
			}
			res.json(data)
		})
})

router.post('/background:userB', function (req, res, next) {
	var userB = 'img/' + req.params.userB
	var user = req.session.user
	User.update({ username: user.username }, {$set: { background: userB }},
		function (err, data) {
			if(err) {
				return next(err)
			}
		})
})

router.post('/headlineB:userB', function (req, res, next) {
	var userB = 'img/' + req.params.userB
	var user = req.session.user
	User.update({ username: user.username }, {$set: { headlineB: userB }},
		function (err, data) {
			if(err) {
				return next(err)
			}
			res.json(data)
		})
})

router.post('/resetBck', function (req, res, next) {
	User.update({ username: req.session.user.username },
	{$set: { background: ""}}, function (err, data) {
		if(err) {
			return next(err)
		}
		res.json(data)
	})
})


router.post('/resetHeadBck', function (req, res, next) {
	User.update({ username: req.session.user.username },
	{$set: { headlineB: ""}}, function (err, data) {
		if(err) {
			return next(err)
		}
		res.json(data)
	})
})


module.exports = router