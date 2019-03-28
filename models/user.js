var mongoose = require('mongoose');
var passprtLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
	username : String,
	password : String
});

UserSchema.plugin(passprtLocalMongoose);

module.exports = mongoose.model("User", UserSchema);