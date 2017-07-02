/**
 * AccountController
 *
 * @description :: Server-side logic for managing accounts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

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
					reject();
				}
				if(!user.isVerified) {
					reject(new Error('Please verify account before setting a password'));
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
	
};

