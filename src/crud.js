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
				// id: uuid.v1(),
				name: data.name,
				email: data.email,
				password: data.password,
				createdAt: timeStamp,
				updatedAt: timeStamp,
			}
		};

		dynamoDb.put(params, (err, response) => {
			if (err) {
				console.error(error);
				callback(new Error('Something went wrong. Please try again'));
				return;
			} else {
				callback(null, {
					statusCode: 200,
					message: 'Created successfully',
					// data: JSON.stringify(response.Item)
				});
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
				callback(null, response)
			}
		})
	},
}