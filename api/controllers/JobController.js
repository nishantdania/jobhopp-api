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
	},

	addJobPost: (req, res) => {  

		const success = ResponseService.success(res);
		const failure = ResponseService.failure(res);
		const user = req.user;
		const params = req.allParams();
		
		var query = {
			user: user,
			company: params.company,
			role: params.role,
			location: params.location,
			link: params.link,
			category: params.category
		};

		JobPost.create(query)
		.then(success)
		.catch(failure)
		
	},

	deleteJobPost: (req, res) => {

		const success = ResponseService.success(res);
		const failure = ResponseService.failure(res);

		var findQuery = {
			id : req.params.id,
			user: req.user.id
		};

		var updateQuery = {
			isDeleted : true
		};
	
		var checkPost = (post) => new Promise((resolve, reject) => {
			if(post.length < 1) {
				reject();
			}
			resolve(post);
		});

		JobPost.update(findQuery, updateQuery)
		.then(checkPost)
		.then(success)
		.catch(failure)

	},

	fetchUserJobPosts: (req, res) => {
		
		const success = ResponseService.success(res);
		const failure = ResponseService.failure(res);
		const user = req.user;

		var prune = (user) => new Promise((resolve, reject) => {
			var filtered = user.jobPosts.filter((post) => {
				return !post.isDeleted
			});
			resolve(filtered);
		});

		User.findOne({id : user.id})
		.populate('jobPosts')
		.then(prune)
		.then(success)
		.catch(failure)
		
	},
	
};

