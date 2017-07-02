var mgcon	= sails.config.mailgun;
var mailgun = require('mailgun-js')({apiKey: mgcon.api_key, domain: mgcon.domain});

const NOREPLY = 'Jobhopp<noreply@mg.jobhopp.com>';
const VERIFICATION_SUBJECT = 'Please verify your Jobhopp account';

var sendMail = (data, resolve, reject) => {
	mailgun.messages().send(data, function (error, body) {
		if(error) {
			reject(error);
		}
		else { 
			resolve(body);
		}
	});
};

module.exports = {

	validateEmail: function(email) {
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	},

	sendVerificationEmail: (options) => new Promise((resolve, reject) => {
		var email = options.email;
		var token = options.token;

		var html = '<html>Hi\nYour verification link is <a>' + token + '</a></html>';

		var data = {
			from: NOREPLY,
			to: options.email,
			subject: VERIFICATION_SUBJECT,
			html: html
		};	

		sendMail(data, resolve, reject);

	}),

}
