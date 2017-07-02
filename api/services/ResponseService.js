module.exports = {

	success: (res) => {
		return (object) => {  
			res.ok(object || {});
		}
	},

	failure: (res) => { 
		return (err) => { 
			res.badRequest(err);
		}
	}

}
