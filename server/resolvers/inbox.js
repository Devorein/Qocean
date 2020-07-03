const user = require('./user');

module.exports = {
	InboxType: {
		async messages(parent, args, { Message }) {
			return await Message.find({ inbox: parent._id });
		},
		async user(parent, args, { User }) {
			return await User.findById(parent.user);
		}
	}
};
