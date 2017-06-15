const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')


const UserSchema = mongoose.Schema({
	username: {	type: String, required: true, required: true },
	password: {	type: String, required: true },
	email: { type: String, required: true },
	name: {	type: String },
	tasks: {
		done: { type: Array },
		inProgress: { type: Array }  
	}
})

const User = module.exports = mongoose.model('User', UserSchema)




// module.exports.getUserById = function (id, callback) {
// 	User.findById(id, callback)
// }

// module.exports.getUserByUsername = function (username, callback) {
// 	const query = { username: username }
// 	User.findOne(query, callback)
// }

// module.exports.addUser = function(newUser, callback) {
// 	bcrype.genSalt(10, (err, salt) => {
// 		bcrypt.hash(newUser, password, salt, (err, hash) => {
// 			if(err) throw err;
// 			newUser.password = hash;
// 			newUser.save(callback);
// 		})
// 	})
// }





