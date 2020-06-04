import React, { Component } from 'react';
import CustomModal from '../../components/Modal/CustomModal';
import FolderForm from '../../resources/Form/FolderForm';
import QuestionForm from '../../resources/Form/QuestionForm';
import QuizForm from '../../resources/Form/QuizForm';
import EnvironmentForm from '../../resources/Form/EnvironmentForm';
import { AppContext } from '../../context/AppContext';

class FormFiller extends Component {
	static contextType = AppContext;

	transformValue = (defaultInputs) => {
		let { data: target } = this.props;
		function recurse(defaultInputs) {
			defaultInputs.forEach((defaultInput, index) => {
				if (defaultInput) {
					const { type, defaultValue, name } = defaultInput;
					if (type !== 'group') {
						defaultInput.defaultValue = target[name]
							? target[name]
							: defaultValue ? defaultValue.toString() : typeof defaultValue === 'boolean' ? true : '';
					} else recurse(defaultInput.children);
				}
			});
		}
		recurse(defaultInputs);
		return defaultInputs;
	};

	decideForm = () => {
		const { transformValue } = this;
		const { type, data, user, submitMsg, onSubmit } = this.props;

		const props = {
			user,
			submitMsg,
			onSubmit,
			customInputs: transformValue
		};
		if (data) {
			if (type.toLowerCase() === 'folder') return <FolderForm {...props} selected_quizzes={data.quizzes} />;
			else if (type.toLowerCase() === 'question')
				return (
					<QuestionForm
						{...props}
						defaultType={data.type}
						selected_quiz={data.quiz ? data.quiz._id : ''}
						defaultAnswers={data.answers}
						blank_count={data.type === 'FIB' ? data.name.match(/\$\{_\}/g).length : 0}
						defaultOptions={data.options}
					/>
				);
			else if (type.toLowerCase() === 'quiz')
				return <QuizForm {...props} tags={data.tags} src={data.image} selected_folders={data.folders} />;
			else if (type.toLowerCase() === 'environment') return <EnvironmentForm {...props} />;
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

export default FormFiller;
