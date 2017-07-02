/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var uuid = require('uuid/v4');

module.exports = {
	
	register: function(req, res) {
		var email = req.param('email');
		var token = uuid();

		var options = {
			email: email,
			token: token
		};

		EmailService.sendVerificationEmail(options, function(err, success) {
			res.status(200).send({token: token});
		});

	}

};

