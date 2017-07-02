var jwt = require('jsonwebtoken');
const SECRET = 'n3v3rparkth3caroutsid3inth3dark!';
const EXPIRES_IN = '60 days';

module.exports = {

	generateToken: (payload) => {
		var expiry = {
			expiresIn : EXPIRES_IN
		};
		return jwt.sign(payload, SECRET, expiry);
	},

	verifyToken: (token, cb) => {  
		return jwt.verify(token, SECRET, cb);
	},

}
