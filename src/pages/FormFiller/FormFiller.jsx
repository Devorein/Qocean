import React, { Component } from 'react';
import CustomModal from '../../components/Modal/CustomModal';
import FolderForm from '../../resources/Form/FolderForm';
import QuestionForm from '../../resources/Form/QuestionForm';
import QuizForm from '../../resources/Form/QuizForm';
import EnvironmentForm from '../../resources/Form/EnvironmentForm';
import { AppContext } from '../../context/AppContext';
import CustomSnackbars from '../../components/Snackbars/CustomSnackbars';
import submitForm from '../../operations/submitForm';
import setEnvAsCurrent from '../../operations/setEnvAsCurrent';
import updateResource from '../../operations/updateResource';

function formSubmitUtil({ reset, resetForm, setSubmitting, postSubmit, data }) {
	if (reset) resetForm();
	setSubmitting(true);
	setTimeout(() => {
		setSubmitting(false);
	}, 2500);
	if (postSubmit) postSubmit(data);
}

class FormFiller extends Component {
	static contextType = AppContext;

	updateResource = ([ type, preSubmit, postSubmit ], values, { setSubmitting, resetForm }) => {
		type = type.toLowerCase();
		const { refetchData, data } = this.props;
		const id = data._id;
		const { reset_on_success, reset_on_error } = this.context.user.current_environment;
		let canSubmit = true;
		if (preSubmit) {
			let [ transformedValue, shouldSubmit ] = preSubmit(values);
			values = transformedValue;
			canSubmit = shouldSubmit;
		}
		if (canSubmit) {
			updateResource(type, id, values)
				.then((data) => {
					formSubmitUtil({ reset: reset_on_success, resetForm, setSubmitting, postSubmit, data });
					this.changeResponse(`Success`, `Successsfully updated ${type} ${values.name}`, 'success');
					if (type.toLowerCase() === 'environment' && values.set_as_current) {
						setEnvAsCurrent(data.data.data._id).then(() => {
							if (refetchData) refetchData();
						});
					} else if (refetchData) refetchData();
				})
				.catch((err) => {
					formSubmitUtil({ reset: reset_on_error, resetForm, setSubmitting, postSubmit, data: err });
					this.changeResponse(
						`An error occurred`,
						err.response.data ? err.response.data.error : `Failed to update ${type}`,
						'error'
					);
				});
		} else {
			setSubmitting(true);
			setTimeout(() => {
				setSubmitting(false);
			}, 2500);
		}
	};

	createResource = ([ type, preSubmit, postSubmit ], values, { setSubmitting, resetForm }) => {
		type = type.toLowerCase();
		const { reset_on_success, reset_on_error } = this.context.user.current_environment;
		let canSubmit = true;
		if (preSubmit) {
			let [ transformedValue, shouldSubmit ] = preSubmit(values);
			values = transformedValue;
			canSubmit = shouldSubmit;
		}
		if (canSubmit) {
			submitForm(type, values)
				.then((data) => {
					formSubmitUtil({ reset: reset_on_success, resetForm, setSubmitting, postSubmit, data });
					this.changeResponse(`Success`, `Successsfully created ${type} ${values.name}`, 'success');
					if (type.toLowerCase() === 'environment' && values.set_as_current) {
						setEnvAsCurrent(data.data.data._id).then(() => {
							this.context.refetch();
						});
					}
				})
				.catch((err) => {
					formSubmitUtil({ reset: reset_on_error, resetForm, setSubmitting, postSubmit, data: err });
					this.changeResponse(
						`An error occurred`,
						err.response.data ? err.response.data.error : `Failed to create ${type}`,
						'error'
					);
				});
		} else {
			setSubmitting(true);
			setTimeout(() => {
				setSubmitting(false);
			}, 2500);
		}
	};

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
		const { data, submitMsg } = this.props;
		const page = this.props.page.toLowerCase();
		const type = this.props.type.toLowerCase();
		const props = {
			user: this.context.user,
			submitMsg: submitMsg || page,
			onSubmit: page !== 'self' ? this.createResource : this.updateResource,
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
			<CustomSnackbars>
				{({ changeResponse }) => {
					this.changeResponse = changeResponse;
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
				}}
			</CustomSnackbars>
		);
	}
}

export default FormFiller;
