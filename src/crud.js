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
				callback({
					status: false,
					message: 'Something went wrong. Please try again'
				}, null);
			} else {
				callback(null, {
					status: true,
					message: 'Created successfully',
					data: Json.stringify(response.Item)
				});
			}
		})
	}
}