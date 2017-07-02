/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var uuid = require('uuid/v4');

module.exports = {
	
	register: function(req, res) {

		const success = ResponseService.success(res);
		const failure = ResponseService.failure(res);
		const params = req.allParams();

		var checkExistingUser = (params) => new Promise((resolve, reject) => { 
			var email = params.email;

			if(!EmailService.validateEmail(email)) {  
				reject(new Error('Invalid email'));
			}

			User.findOne({email:email})
			.then((user) => { 
				if(user) {
					reject(new Error('User already exists'));
				}
				else {
					resolve(email);
				}
			})
			.catch(reject)

		});

		var createUser = (email) => new Promise((resolve, reject) => {

			var today = new Date();
			var tomorrow = new Date();
			tomorrow.setDate(today.getDate() + 1);

			var token = uuid();

			var query = {
				email : email,
				verificationToken: token,
				verificationExpire: tomorrow
			};
	
			User.create(query)
			.then((user) => {  
				var options = {
					email: email,
					token: token
				};
				resolve(options);
			})
			.catch(reject)

		});

		checkExistingUser(params)
		.then(createUser)
		.then(EmailService.sendVerificationEmail)
		.then(success)
		.catch(failure);

	},



};

