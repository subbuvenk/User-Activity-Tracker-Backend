var mongoose = require('mongoose');

//SCHEMA FOR LOGIN LOGS MODEL
var loginSchema = mongoose.Schema({
		email: {
			type: String,
			required: true,
			trim: true
		},
		timestamp: {
			type: String,
			required: true
		},
		action: {
			type: String,
			required: true
		}
});

//EXPOSE USER MODEL
module.exports = mongoose.model('Login', loginSchema);