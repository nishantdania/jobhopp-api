/**
 * AccountController
 *
 * @description :: Server-side logic for managing accounts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var uuid = require('uuid/v4');

module.exports = {

	resetPassword: (req, res) => {
		
		const success = ResponseService.success(res);
		const failure = ResponseService.failure(res);
		const params = req.allParams();

		var checkTokenValidity = (params) => new Promise((resolve, reject) => {  

			const password = params.password;
			const token = params.token;

			if(!token || !password || password.length < 8) {
				reject(new Error('Invalid token or password'));
			}

			User.findOne({passwordToken : token})
			.then((user) => {
				if(!user) {
					return reject();
				}
				if(!user.isVerified) {
					return reject(new Error('Please verify account before setting a password'));
				}
				resolve({
					password : password,
					user : user
				});
			})
			.catch(reject)

		});

		var updatePassword = (data) => new Promise((resolve, reject) => {  

			const password = data.password;
			const user = data.user;

			User.hashPassword(password)
			.then((hash) => {
				user.password = hash;
				user.passwordToken = null;
				user.passwordTokenExpire = null;
				user.save();
				resolve();
			})
			.catch(reject)			

		});

		checkTokenValidity(params)
		.then(updatePassword)
		.then(success)
		.catch(failure)

	},	

	resetPasswordRequest: (req, res) => {  
		
		const success = ResponseService.success(res);
		const failure = ResponseService.failure(res);
		const params = req.allParams();

		var checkIfVerified = (params) => new Promise((resolve, reject) => {  
			const email = params.email;
			if(!email || !EmailService.validateEmail(email)) {
				reject(new Error('Invalid email'));
			}
			User.findOne({email : email})
			.then((user) => {
				if(!user.isVerified) {
					reject(new Error('Account not verified'))
				}
				resolve(user);
			})
			.catch(reject)
		});

		var updateToken = (user) => new Promise((resolve, reject) => {
			var token =	uuid();
			var expiry = new Date();
			expiry.setHours(expiry.getHours() + 6);
			user.passwordToken = token;
			user.passwordTokenExpire = expiry;
			user.save()
			.then((err) => {
				if(err) {
					return reject();
				}
				resolve({
					email : user.email,
					token : token
				}); 
			});
		});

		checkIfVerified(params)
		.then(updateToken)
		.then(EmailService.sendPasswordResetEmail)
		.then(success)
		.catch(failure)
		
	},
	
};

