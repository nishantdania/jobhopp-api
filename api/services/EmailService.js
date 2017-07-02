var mgcon	= sails.config.mailgun;
var mailgun = require('mailgun-js')({apiKey: mgcon.api_key, domain: mgcon.domain});
var EmailTemplate = require('email-templates').EmailTemplate;
var path = require('path');

var templatesDir = path.resolve(__dirname, '../../assets/templates');

const NOREPLY = 'Jobhopp<noreply@mg.jobhopp.com>';
const VERIFICATION_SUBJECT = 'Please verify your Jobhopp account';

var sendMail = (data, resolve, reject) => {
	if(mgcon.pause) {
		return resolve();
	}
	mailgun.messages().send(data, function (error, body) {
		if(error) {
			return reject(error);
		}
		else { 
			return resolve();
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

		var template = new EmailTemplate(path.join(templatesDir, 'verificationEmail'));
		var locals = {
			url: token
		};

		template.render(locals, function (err, results) {
			if (err) {
				return console.error(err);
			}
			var data = {
				from: NOREPLY,
				to: options.email,
				subject: VERIFICATION_SUBJECT,
				html: results.html
			};	
			sendMail(data, resolve, reject);
		});
/**
		var data = {
			from: NOREPLY,
			to: options.email,
			subject: VERIFICATION_SUBJECT,
			html: html
		};	

		sendMail(data, resolve, reject);
**/
	}),

	sendPasswordResetEmail: (options) => new Promise((resolve, reject) => {
		var email = options.email;
		var token = options.token;

		var html = '<html>Hi\nYour password reset link is<a>' + token + '</a></html>';

		var data = {
			from: NOREPLY,
			to: options.email,
			subject: VERIFICATION_SUBJECT,
			html: html
		};	

		sendMail(data, resolve, reject);

	}),
}
