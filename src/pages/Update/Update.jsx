import React, { Component } from 'react';
import CustomModal from '../../components/Modal/CustomModal';
import FolderForm from '../../resources/Form/FolderForm';
import QuestionForm from '../../resources/Form/QuestionForm';
import QuizForm from '../../resources/Form/QuizForm';
import EnvironmentForm from '../../resources/Form/EnvironmentForm';
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
			if (type === 'Folder') return <FolderForm {...props} />;
			else if (type === 'Question') return <QuestionForm {...props} />;
			else if (type === 'Quiz')
				return (
					<QuizForm
						{...props}
						ref={(r) => {
							this.QuizForm = r;
							if (this.QuizForm)
								this.QuizForm.setState({
									tags: data.tags
								});
						}}
					/>
				);
			else if (type === 'Environment') return <EnvironmentForm {...props} />;
		} else return <div>N/A</div>;
	};
	render() {
		const { decideForm } = this;
		const { isOpen, handleClose } = this.props;

		return (
			<div className="update">
				<CustomModal handleClose={handleClose} isOpen={isOpen}>
					{decideForm()}
				</CustomModal>
			</div>
		);
	}
}

export default Update;
