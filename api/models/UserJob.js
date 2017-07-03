/**
 * UserJob.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

		company: {
			type: 'string',
			required: true
		},

		role: {
			type: 'string'
		},

		location: {
			type: 'string'
		},

		link: {
			type: 'string'
		},

		category: {
			type: 'string'
		},

		status: { 
			type: 'string',
			enum: ['interested', 'applied', 'offered', 'accepted', 'rejected', 'interview', 'test'],
			defaultsTo: 'interested'
		},

		nextDeadline: {
			type: 'datetime'
		},

		dateApplied: {  
			type: 'datetime'
		},

		notes: {
			type: 'text'
		},

		user: {
			model: 'user'
		},

		isDeleted: { 
			type: 'boolean',
			defaultsTo: false
		},

  }
};

