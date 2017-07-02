/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

		email: {
			type: 'string',
			unique: true
		},

		encPassword: {
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

  }
};

