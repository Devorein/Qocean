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
		const { data, user, submitMsg, onSubmit } = this.props;
		const page = this.props.page.toLowerCase();
		const type = this.props.type.toLowerCase();
		const props = {
			user,
			submitMsg,
			onSubmit,
			customInputs: page !== 'create' ? transformValue : null
		};
		if (data) {
			if (type === 'folder') props.selected_quizzes = page === 'self' ? data.quizzes.map(({ _id }) => _id) : [];
			else if (type === 'question') {
				props.defaultType = data.type;
				props.selected_quiz = data.quiz ? data.quiz._id : '';
				props.defaultAnswers = data.answers;
				props.blank_count = data.type === 'FIB' ? data.name.match(/\$\{_\}/g).length : 0;
				props.defaultOptions = data.options;
			} else if (type === 'quiz') {
				props.tags = data.tags;
				props.src = data.image;
				props.selected_folders = page === 'self' ? data.folders.map(({ _id }) => _id) : [];
			}
		}

		if (type === 'folder') return <FolderForm {...props} />;
		else if (type === 'question') return <QuestionForm {...props} />;
		else if (type === 'quiz') return <QuizForm {...props} />;
		else if (type === 'environment') return <EnvironmentForm {...props} />;
	};

	render() {
		const { decideForm } = this;
		const { isOpen, handleClose, useModal = true, onArrowClick } = this.props;

		return (
			<div className="FormFiller">
				{useModal ? (
					<CustomModal handleClose={handleClose} isOpen={isOpen} onArrowClick={onArrowClick}>
						{decideForm()}
					</CustomModal>
				) : (
					decideForm()
				)}
			</div>
		);
	}
}

export default FormFiller;
