var mongoose = require('mongoose')
var Schema = mongoose.Schema

var UserSchema = new Schema({
	username: {
	//	required: true,
	//	unique: true,
		type: String
	},
	email: {
	//	required: true,
	//	unique: true,
		type: String
	},
})

module.exports = mongoose.model('User', UserSchema)



