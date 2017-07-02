/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var uuid = require('uuid/v4');

module.exports = {
	
	register: (req, res) => {

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

	verify: (req, res) => {  

		const success = ResponseService.success(res);
		const failure = ResponseService.failure(res);
		const params = req.allParams();

		var checkTokenValidity = (params) => new Promise((resolve, reject) => {  
			var token = params.token;
			if(!token) {  
				reject(new Error('Invalid token'));
			}
			User.findOne({verificationToken : token})
			.then((user) => {  
				if(!user) { 
					reject(new Error('Invalid token'));
				}

				var expires = user.verificationExpire;
				var today = new Date();
				var timeDifference = expires.getTime() - today.getTime();

				if(timeDifference <= 0) {  
					reject(new Error('Token Expired'));
				}
				resolve(user);
			})
			.catch(reject)
		});

		var updateUser = (user) => new Promise((resolve, reject) => {
			var passwordToken = uuid();			
			var today = new Date();
			var expiry = new Date();
			expiry.setHours(today.getHours() + 6);

			user.isVerified = true;
			user.verificationToken = null;
			user.verificationExpire = null;
			user.passwordToken = passwordToken;
			user.passwordTokenExpire = expiry;
	
			user.save((err) => {
				if(err) {  
					return reject();
				}
				var obj = {
					token : passwordToken
				};
				resolve(obj);
			})
		});

		checkTokenValidity(params)
		.then(updateUser)
		.then(success)
		.catch(failure)				

	},

	verifyRequest: (req, res) => {  
		
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
				if(user.isVerified) {
					reject(new Error('Account already verified'))
				}
				resolve(user);
			})
			.catch(reject)
		});

		var updateToken = (user) => new Promise((resolve, reject) => {
			var token =	uuid();
			var expiry = new Date();
			expiry.setDate(expiry.getDate() + 1);
			user.verificationToken = token;
			user.verificationExpire = expiry;
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
		.then(EmailService.sendVerificationEmail)
		.then(success)
		.catch(failure)
		
	},

	login: (req, res) => {

		const success = ResponseService.success(res);
		const failure = ResponseService.failure(res);
		const params = req.allParams();

		var fetchUser = (params) => new Promise((resolve, reject) => {  
			const email = params.email;
			const password = params.password;

			if(!email || !password || !EmailService.validateEmail(email)) {
				reject(new Error('Invalid email or password'));
			}

			User.findOne({email : email})
			.then((user) => {  
				if(!user) {
					reject();
				}
				else {
					User.comparePassword(password, user.password)
					.then((valid) => {  
						if(valid) {
							resolve(user);
						}
						else {
							reject(new Error('Invalid email or password'));
						}
					})
					.catch(reject)
				}
				
			})
			.catch(reject)

		});

		var generateToken = (user) => new Promise((resolve, reject) => {
			var payload = {
				id: user.id
			};
			var token = JwtService.generateToken(payload);
			var data = { token : token };
			resolve(data);
		});

		fetchUser(params)
		.then(generateToken)
		.then(success)
		.catch(failure)

	},

};

