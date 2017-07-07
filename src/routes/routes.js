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

router.get('/tasks', function (req, res, next) {
	res.render('todo', { title: 'Tasks' })
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

	User.findOne({ username: username }, function (err, user) {
		if(err) {
			return next(err)
		}
		if(!user) {
			var err = new Error('Invalid username')
			return next(err)
		}

		req.session.user = user
		res.redirect('profile')

		// user.comparePassword(password, user.password, function (err, isMatch) {
		// 	if (err) {
		// 		return next(err)
		// 	}

		// 	if(!isMatch){
		// 		var err = new Error('Invalid password')
		// 		return next(err)
		// 	}

		// 	req.session.user = user
		// 	res.redirect('profile')
		// })
	})
})

router.get('/logout', function (req, res, next) {
	req.session.destroy()
	res.redirect('home')
})

router.get('/signup', function (req, res, next) {
	res.render('register', { title: 'Sign up' })
	next() 
})

router.post('/signup', function (req, res, next) {

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

	// // save user to database
	// newUser.save(function (err) {
	//     if (err) throw err;

	//     // fetch user and test password verification
	//     User.findOne({ username: username }, function (err, user) {
	//         if (err) throw err;

	//         // test a matching password
	//         user.comparePassword( user.password, function(err, isMatch) {
	//             if (err) {
	//             	throw err;
	//             }
	//             else {
	//             	console.log('Password123:', isMatch); // -> Password123: true
	//             }
	//         });

	//         // test a failing password
	//         user.comparePassword('123Password', function(err, isMatch) {
	//             if (err) throw err;
	//             console.log('123Password:', isMatch); // -> 123Password: false
	//         });
	//     });
	// });
	// MY CODE


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

router.post('/clearTasks', function (req, res, next) {
	User.update({ username: req.session.user.username },
	{$set: { "tasks.done": [] }}, { multi: true }, function (err, data) {
		if(err) {
			return next(err)
		}
		res.json(data)
	})
})

module.exports = router