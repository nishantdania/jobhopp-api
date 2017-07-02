/**
 * JobController
 *
 * @description :: Server-side logic for managing jobs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	fetchAllJobs : function(req, res) {
		Job.find({})
			.then(function(jobs) {
				res.status(200).send(jobs);
			})
			.catch(function(err) {
				res.status(400).send(err);
			})
	}	
};

