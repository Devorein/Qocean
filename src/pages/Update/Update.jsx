import React, { Component } from 'react';
import CustomModal from '../../components/Modal/CustomModal';
import CreateFolder from '../Create/CreateFolder';
import CreateQuestion from '../Create/CreateQuestion';
import CreateQuiz from '../Create/CreateQuiz';
import CreateEnvironment from '../Create/CreateEnvironment';
import { AppContext } from '../../context/AppContext';

class Update extends Component {
	static contextType = AppContext;

	transformValue = (defaultInputs) => {
		let { data: target } = this.props;
		function recurse(defaultInputs) {
			defaultInputs.forEach((defaultInput, index) => {
				const { type, defaultValue } = defaultInput;
				if (type !== 'group') {
					defaultInput.defaultValue = target[defaultInput.name]
						? target[defaultInput.name]
						: defaultValue.toString() ? defaultValue : typeof defaultValue === 'boolean' ? true : '';
				} else recurse(defaultInput.children);
			});
		}
		recurse(defaultInputs);
		return defaultInputs;
	};

	decideForm = () => {
		const { transformValue } = this;
		const { type, data, user } = this.props;

		const props = {
			user,
			submitMsg: 'Update',
			onSubmit: this.context.submitForm,
			customInputs: transformValue
		};

		if (data) {
			if (type === 'Folder') return <CreateFolder {...props} />;
			else if (type === 'Question') return <CreateQuestion {...props} />;
			else if (type === 'Quiz')
				return (
					<CreateQuiz
						{...props}
						ref={(r) => {
							this.CreateQuiz = r;
							if (this.CreateQuiz)
								this.CreateQuiz.setState({
									tags: data.tags
								});
						}}
					/>
				);
			else if (type === 'Environment') return <CreateEnvironment {...props} />;
		} else return <div>N/A</div>;
	};
	render() {
		const { decideForm } = this;
		const { isOpen } = this.props;

		return (
			<div className="update">
				<CustomModal isOpen={isOpen}>{decideForm()}</CustomModal>
			</div>
		);
	}
}

export default Update;
