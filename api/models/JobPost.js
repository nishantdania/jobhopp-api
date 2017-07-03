/**
 * JobPost.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

		company: {
			type: 'string'
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

		user: {
			model: 'user'
		},

  }
};

