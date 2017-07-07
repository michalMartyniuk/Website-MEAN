var mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

var UserSchema = mongoose.Schema({
	username: {	type: String, required: true, required: true },
	password: {	type: String, required: true },
	email: { type: String, required: true },
	name: {	type: String },
	tasks: {
		done: { type: Array },
		inProgress: { type: Array }  
	},
	background: { type: String },
	headlineB: { type: String }
})


UserSchema.pre('save', function(next) {
    var user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, hashedPassword, cb) {
    bcrypt.compare(candidatePassword, hashedPassword, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};


var User = module.exports = mongoose.model('User', UserSchema)





