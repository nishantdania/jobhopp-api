module.exports = function (req, res, next) {
	var token;

	const failure = ResponseService.failure(res);

	if (req.headers && req.headers.authorization) {
		var parts = req.headers.authorization.split(' ');
		if (parts.length == 2) {
			var scheme = parts[0],
			credentials = parts[1];
			if (/^Bearer$/i.test(scheme)) {
				token = credentials;		
			}
		} else {
			return failure(new Error('Authorization format incorrect'));	
		}
	} else {
		return failure(new Error('Authorization not found'));	
	}

	JwtService.verifyToken(token, function (err, payload) {
		if (err) {
			return failure(new Error('Invalid token'));	
		}
		var id = payload.id;
		User.findOne({id : id})
		.then((user) => {  
			if(!user) {
				return failure(new Error('Invalid token, no user'));
			}
			else {
				req.user = user;
				next();
			}
		})
		.catch((err) => {  
			return failure(new Error('Invalid token'));
		})
	});

};
