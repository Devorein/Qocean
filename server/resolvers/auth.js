const crypto = require('crypto');
const { ObjectID } = require('bson');

const sendEmail = require('../utils/sendEmail');
const sendTokenResponse = require('../utils/sendTokenResponse');

module.exports = {
	Query: {
		async checkPassword (parent, { password }, { user, User }) {
			if (!user) throw new Error('Not authorized to access this route');
			const _user = await User.findById(user.id).select('+password');
			const isMatch = await _user.matchPassword(password);
			if (!isMatch) throw new Error(`Invalid credentials`);
			return { success: isMatch };
		}
	},
	Mutation: {
		async register (parent, { data }, { User, Inbox, Watchlist, Environment }) {
			const { name, email, password, version, username, image } = data;
			let _user = await User.findOne({ email });
			if (_user) throw new Error(`User with the email ${email} already exists`);
			_user = await User.findOne({ username });
			if (_user) throw new Error(`User with the username ${username} already exists`);
			const env_id = new ObjectID();
			const inbox_id = new ObjectID();
			const watchlist_id = new ObjectID();
			const user_id = new ObjectID();
			const body = {
				name,
				email,
				password,
				version,
				username,
				current_environment: env_id.toString(),
				inbox: inbox_id.toString(),
				watchlist: watchlist_id.toString()
			};
			if (image) body.image = image;
			body._id = user_id;
			const user = await User.create(body);
			await Environment.create({
				user: user_id,
				_id: env_id,
				name: 'Default Environment',
				questioninfo: {},
				keybindings: {},
				self_page: {},
				watchlist_page: {},
				play_page: {},
				explore_page: {}
			});
			await Inbox.create({ user: user._id, _id: inbox_id });
			await Watchlist.create({ user: user._id, _id: watchlist_id });
			return sendTokenResponse(user);
		},

		async login (parent, { data }, { User }) {
			const { email, password } = data;
			if (!email || !password) throw new Error(`Please provide an email and password`);
			const user = await User.findOne({ email }).select('+password');
			if (!user) throw new Error(`Invalid credentials`);
			const isMatch = await user.matchPassword(password);
			if (!isMatch) throw new Error(`Invalid credentials`);
			return sendTokenResponse(user);
		},
		async logout (parent, data, { res }) {
			res.cookie('token', 'none', {
				expires: new Date(Date.now() + 10 * 1000),
				httpOnly: true
			});
			return { success: true };
		},
		async resetPassword (parent, { resetToken, password }, { User }) {
			const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

			const user = await User.findOne({
				resetPasswordToken,
				resetPasswordExpire: { $gt: Date.now() }
			});

			if (!user) throw new Error(`Invalid token`);

			user.password = password;
			user.resetPasswordToken = undefined;
			user.resetPasswordExpire = undefined;
			await user.save();

			return sendTokenResponse(user);
		},
		async forgotPassword (parent, { email }, { User, req }) {
			const user = await User.findOne({ email: email });

			if (!user) throw new Error(`There is no user with that email`);

			const resetToken = user.getResetPasswordToken();
			await user.save({ validateBeforeSave: false });

			const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;

			const message = `Please make a PUT request to ${resetUrl}`;

			try {
				await sendEmail({
					email: user.email,
					subject: 'Password reset token',
					message
				});
				return { success: true, data: `Email sent` };
			} catch (err) {
				console.log(err);
				user.resetPasswordToken = undefined;
				user.resetPasswordExpire = undefined;
				await user.save({ validateBeforeSave: false });
				throw new Error(`Email couldnt be sent`);
			}
		}
	}
};
