'use strict';
const uuid = require('uuid');
const AWS = require('aws-sdk');
// const Helper = require('./password-help');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const timeStamp = new Date().getTime();

module.exports = {
	creat: function (event, context, callback) {
		const data = JSON.parse(event.body);

		const params = {
			TableName: 'user',
			Item: {
				id: uuid.v1(),
				fullname: data.name,
				email: data.email,
				password: data.password,
				createdAt: timeStamp,
				updatedAt: timeStamp,
			}
		};

		dynamoDb.put(params, (err, result) => {
			if (err) {
				console.error(err);
				callback(new Error('Something went wrong. Please try again'));
				return;
			} else {
				const response = {
					statusCode: 200,
					body: JSON.stringify({
						message: 'User added successfully'
					})
				};
				callback(null, response);
			}
		})
	},
	login: function (event, context, callback) {
		const data = JSON.parse(event.body);
		
		const params = {
			TableName: 'user',
			Key: {
				"email": data.email
			}
		};

		dynamoDb.get(params, (error, result) => {
			if(error) {
				console.error(error);
				callback(new Error('Something went wrong. Please try again'));
				return;
			} else {
				let response = {};
				if (result.length > 0) {
					response = {
						statusCode: 200,
						body: JSON.stringify({
							message: 'Email not found'
						})
					};
				} else {
					response = {
						statusCode: 200,
						body: JSON.stringify({
							message: 'Email found'
						})
					};
				}
				callback(null, response);
			}
		})
	},
	get: function (event, context, callback) {
		const params = {
			TableName: 'user',
		};

		dynamoDb.scan(params, (error, result) => {
			if(error) {
				console.error(error);
				callback(new Error('Can not fetch records'));
				return;
			} else {
				const response = {
					statusCode: 200,
					body: JSON.stringify(result)
				};
				callback(null, response);
			}
		})
	},
	delete: function(event, context, callback) {
		const params = {
			TableName: 'user',
			Key: {
				id: event.pathParameters.id
			}
		};

		dynamoDb.delete(params, (err, result) => {
			if (err) {
				console.error(err);
				callback(new Error('Could not remove this record. Please try again'));
				return;
			} else {
				const response = {
					statusCode: 200,
					body: JSON.stringify({
						message: 'User deleted successfully'
					})
				};
				callback(null, response);
			}
		})
	},
	singleRecord: function(event, context, callback) {
		const params = {
			TableName: 'user',
			Key: {
				id: event.pathParameters.id
			}
		};

		dynamoDb.get(params, (err, result) => {
			if (err) {
				console.error(err);
				callback(new Error('Could not fetch this record. Please try again'));
				return;
			} else {
				const response = {
					statusCode: 200,
					body: JSON.stringify(result)
				};
				callback(null, response);
			}
		})
	},
	update: function(event, context, callback) {
		const data = JSON.parse(event.body);
		 
		const params = {
			TableName: 'user',
			Key: {
				"id": event.pathParameters.id
			},
		    UpdateExpression: 'SET email = :value1, fullname = :value2',
		    ExpressionAttributeValues: {
		      ':value1': data.email,
		      ':value2': data.name
		    },
		    ReturnValues:"UPDATED_NEW"
		};

		dynamoDb.update(params, function(err, result) {
			if (err) {
				console.error(err);
				callback(new Error('Could not fetch this record. Please try again'));
				return;
			} else {
				const response = {
					statusCode: 200,
					body: JSON.stringify(result)
				};
				callback(null, response);
			}
		})
	},
	sendEmailWithSESSMTP: function (event, context, callback) {
		var targetEmail = 'target email address will goes here';
		var fromEmail = 'from email address will goes here';
		// var bccEmail = '{BCC_EMAIL_ADDRESS-TO_VERIFY}'
		var sesAccessKey = 'AWS AccessKey'
		var sesSecretKey = 'AWS SecretKey'
		
		var nodemailer = require('nodemailer');
		var smtpTransport = require('nodemailer-smtp-transport');

		var transporter = nodemailer.createTransport(smtpTransport({
		    host: 'email-smtp.us-east-1.amazonaws.com',
		    port: 587,
		    auth: {
		        user: sesAccessKey,
		        pass: sesSecretKey
		    }
		}));

		var text = 'Test E-mail address';

		var mailOptions = {
		    from: fromEmail,
		    to: targetEmail,
		    // bcc: bccEmail,
		    subject: 'Invoice',
		    text: text 
		};
			
		transporter.sendMail(mailOptions, function(error, info){
          	if(error){
    	      	console.log(error);
          	}

          	context.done(null, 'Completed')
      	});
	}
}