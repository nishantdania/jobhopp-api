/**
 * UserJobController
 *
 * @description :: Server-side logic for managing userjobs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	addUserJob: (req, res) => {

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
			category: params.category,
			status: params.status,
			nextDeadline: params.nextDeadline,
			dateApplied: params.dateApplied,
			notes: params.notes
		};

		UserJob.create(query)
		.then(success)
		.catch(failure)
	
	},

	updateUserJob: (req, res) => {  

		const success = ResponseService.success(res);
		const failure = ResponseService.failure(res);
		const params = req.allParams();

		var findQuery = {
			id : req.params.id,
			user: req.user.id
		};

		var updateQuery = {
				company: params.company,
				role: params.role,
				location: params.location,
				link: params.link,
				category: params.category,
				status: params.status,
				nextDeadline: params.nextDeadline,
				dateApplied: params.dateApplied,
				notes: params.notes
		};
	
		var checkPost = (post) => new Promise((resolve, reject) => {
			if(post.length < 1) {
				reject();
			}
			resolve(post);
		});

		UserJob.update(findQuery, updateQuery)
		.then(checkPost)
		.then(success)
		.catch(failure)


	},

	deleteUserJob: (req, res) => {  

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

		UserJob.update(findQuery, updateQuery)
		.then(checkPost)
		.then(success)
		.catch(failure)

	}, 	

	fetchUserJobs: (req, res) => {
		
		const success = ResponseService.success(res);
		const failure = ResponseService.failure(res);
		const user = req.user;

		var prune = (user) => new Promise((resolve, reject) => {
			var filtered = user.dreamlist.filter((post) => {
				return !post.isDeleted
			});
			resolve(filtered);
		}); 

		User.findOne({id : user.id})
		.populate('dreamlist')
		.then(prune)
		.then(success)
		.catch(failure)
		
	},
	
};

