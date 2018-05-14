var bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
	createHash: function(password) {
		bcrypt.hash(password, saltRounds, function(err, hash) {
			return hash;
		});
	}
}