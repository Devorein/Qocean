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
		const { data, user, submitMsg, onSubmit, page } = this.props;
		const type = this.props.type.toLowerCase();
		const props = {
			user,
			submitMsg,
			onSubmit,
			customInputs: transformValue
		};
		if (data) {
			if (type === 'folder')
				return <FolderForm {...props} selected_quizzes={page === 'Self' ? data.quizzes.map(({ _id }) => _id) : []} />;
			else if (type === 'question')
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
			else if (type === 'quiz')
				return (
					<QuizForm
						{...props}
						tags={data.tags}
						src={data.image}
						selected_folders={page === 'Self' ? data.folders.map(({ _id }) => _id) : []}
					/>
				);
			else if (type === 'environment') return <EnvironmentForm {...props} />;
		} else return <div>N/A</div>;
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
