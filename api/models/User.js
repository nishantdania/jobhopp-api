/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var bcrypt = require('bcrypt');

module.exports = {

  attributes: {

		email: {
			type: 'string',
			unique: true
		},

		password: {
			type: 'string'
		},

		fullname: { 
			type: 'string'
		},

		isVerified: {
			type: 'boolean',
			defaultsTo: false
		},

		verificationToken: {
			type: 'string',
			defaultsTo: null
		},

		verificationExpire: {
			type: 'datetime'
		},		

		passwordToken: {
			type: 'string',
			defaultsTo: null
		},

		passwordTokenExpire: {
			type: 'datetime'
		},

		jobPosts: {  
			collection: 'jobPost',
			via: 'user'
		},

		dreamlist: {  
			collection: 'userJob',
			via: 'user'
		},

  },

	hashPassword: (password) => new Promise((resolve, reject) => { 
		bcrypt.hash(password, 10)
		.then(resolve)
		.catch(reject)
	}),

	comparePassword: (password, hash) => new Promise((resolve, reject) => {  
	 bcrypt.compare(password, hash)
		.then(resolve)
		.catch(reject)
	}),

};

