'use strict';
const uuid = require('uuid');
const AWS = require('aws-sdk');
const Helper = require('./password-help');
const dynamoDb = new AWS.DynamoDb.DocumentClient();
const timeStamp = new Date().getTime();

module.exports = {
	creat: function (event, context, callback) {
		const data = Json.parse(event.body);

		const params = {
			TableName: 'user',
			Item: {
				id: uuid.v3(),
				name: data.name,
				email: data.email,
				password: Helper.createHash(data.password),
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
					data: Json.stringify(response.Item)
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
					body: Json.stringify(result)
				};
				callback(null, response)
			}
		})
	},
}