const EnvironmentResolvers = {
	Query: {},
	Mutation: {
		async setCurrentEnvironment (parent, { id }, { user, Environment, User }) {
			const environment = await Environment.findOne({ _id: id, user: user.id });
			const _user = await User.findById(user.id);
			_user.current_environment = environment._id;
			await _user.save();
			return environment;
		},
		async deleteEnvironments (_, { ids }, { Environment, User, user }) {
			const deleted_environments = [];
			const totalDocs = await Environment.countDocuments({ user: user.id });
			const _user = await User.findById(user.id);
			for (let i = 0; i < ids.length; i++) {
				const environmentId = ids[i];
				const environment = await Environment.findById(environmentId).select('name user');
				if (!environment) throw new new Error(`Environment not found with id of ${environmentId}`)();
				if (environment.user.toString() !== user.id.toString())
					throw new new Error(`User not authorized to delete environment`)();
				if (_user.current_environment.toString() === environment._id.toString())
					throw new new Error(`You cannot delete current set environment`)();
				else if (i < totalDocs) await environment.remove();
				else throw new new Error(`You must have atleast one environment`)();
				await environment.remove();
				deleted_environments.push(environment);
			}
		}
	}
};

module.exports = EnvironmentResolvers;
