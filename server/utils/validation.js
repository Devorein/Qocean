module.exports = {
	isAlphaNumericOnly: function (input) {
		const letterNumberRegex = /^([0-9a-z]|_|\.)+$/;
		if (input.match(letterNumberRegex)) return true;
		return false;
	},
	isLongEnough: function (input) {
		if (input.length >= 6) return true;
		return false;
	},
	isStrongPassword: function (input) {
		// at least one number, one lowercase and one uppercase letter
		// at least six characters
		const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
		return regex.test(input);
	},
	isSafe: function (input) {
		const regex = /([$])/;
		return !regex.test(input);
	}
};
