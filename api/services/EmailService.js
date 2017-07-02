var mgcon	= sails.config.mailgun;
var mailgun = require('mailgun-js')({apiKey: mgcon.api_key, domain: mgcon.domain});

const NOREPLY = 'Jobhopp<noreply@mg.jobhopp.com>';
const VERIFICATION_SUBJECT = 'Please verify your Jobhopp account';

module.exports = {

	sendVerificationEmail: function(options, done) {
		var email = options.email;
		var token = options.token;

		var html = '<html>Hi\nYour verification token is <a>' + token + '</a></html>';

		var data = {
			from: NOREPLY,
			to: options.email,
			subject: VERIFICATION_SUBJECT,
			html: html
		};	

		mailgun.messages().send(data, function (error, body) {
			done();
		});
	}

}
