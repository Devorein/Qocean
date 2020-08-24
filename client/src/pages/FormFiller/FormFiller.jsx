import React, { useContext } from 'react';
import { useMutation } from '@apollo/react-components';

import CustomModal from '../../components/Modal/CustomModal';
import FolderForm from '../../resources/Form/FolderForm';
import QuestionForm from '../../resources/Form/QuestionForm';
import QuizForm from '../../resources/Form/QuizForm';
import EnvironmentForm from '../../resources/Form/EnvironmentForm';
import { AppContext } from '../../context/AppContext';
import CustomSnackbars from '../../components/Snackbars/CustomSnackbars';
import Operations from '../../operations/Operations';

function formSubmitUtil ({ reset, resetForm, setSubmitting, postSubmit, data }) {
	if (reset) resetForm();
	setSubmitting(true);
	setTimeout(() => {
		setSubmitting(false);
	}, 2500);
	if (postSubmit) postSubmit(data, 'Create');
}

function FormFiller (props) {
	const { user } = useContext(AppContext);
	const GLOBAL = {};
	const page = props.page.toLowerCase();
	const resource = props.resource.toLowerCase();
	const c_resource = props.resource.charAt(0).toUpperCase() + props.resource.substr(1);
	const [ create ] = useMutation(Operations[`Create${c_resource}_ObjectsNone`]);
	const [ update ] = useMutation(Operations[`Update${c_resource}_ObjectsNone`]);
	const updateResource = ([ resource, preSubmit, postSubmit ], values, { setSubmitting }) => {
		resource = resource.toLowerCase();
		const { refetchData, data } = props;
		const id = data._id;
		let canSubmit = true;
		if (preSubmit) {
			let [ transformedValue, shouldSubmit ] = preSubmit(values);
			values = transformedValue;
			canSubmit = shouldSubmit;
		}
		if (canSubmit) {
			// 			updateResource(resource, id, values)
			// 				.then((data) => {
			// 					if (postSubmit) postSubmit(data, 'Update');
			// 					this.changeResponse(`Success`, `Successsfully updated ${resource} ${values.name}`, 'success');
			// 					if (resource.toLowerCase() === 'environment' && values.set_as_current) {
			// 						setEnvAsCurrent(data.data.data._id).then(() => {
			// 							if (refetchData) refetchData();
			// 						});
			// 					} else if (refetchData) refetchData();
			// 				})
			// 				.catch((err) => {
			// 					this.changeResponse(
			// 						`An error occurred`,
			// 						err.response.data ? err.response.data.error : `Failed to update ${resource}`,
			// 						'error'
			// 					);
			// 				});
		} else {
			setSubmitting(true);
			setTimeout(() => {
				setSubmitting(false);
			}, 2500);
		}
	};

	const createResource = ([ resource, preSubmit, postSubmit ], values, { setSubmitting, resetForm }) => {
		resource = resource.toLowerCase();
		const { reset_on_success, reset_on_error } = user.current_environment;
		let canSubmit = true;
		if (preSubmit) {
			let [ transformedValue, shouldSubmit ] = preSubmit(values);
			values = transformedValue;
			canSubmit = shouldSubmit;
		}
		if (canSubmit) {
			create({ variables: { data: values } })
				.then((data) => {
					formSubmitUtil({ reset: reset_on_success, resetForm, setSubmitting, postSubmit, data });
					GLOBAL.changeResponse(`Success`, `Successsfully created ${resource} ${values.name}`, 'success');
					// if (resource.toLowerCase() === 'environment' && values.set_as_current) {
					// 	setEnvAsCurrent(data.data.data._id).then(() => {
					// 		this.context.refetchUser();
					// 	});
					// }
				})
				.catch((err) => {
					formSubmitUtil({ reset: reset_on_error, resetForm, setSubmitting, postSubmit, data: err });
					GLOBAL.changeResponse(
						`An error occurred`,
						err.response.data ? err.response.data.error : `Failed to create ${resource}`,
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

	const transformValue = (defaultInputs) => {
		let { data: target } = props;
		function recurse (defaultInputs) {
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

	const decideForm = () => {
		const { data, submitMsg } = props;

		const common_props = {
			user,
			submitMsg: submitMsg || page,
			onSubmit: page !== 'self' ? createResource : updateResource,
			transformInputs: page !== 'create' ? transformValue : null,
			changeResponse: GLOBAL.changeResponse
		};
		if (data) {
			if (resource === 'folder')
				common_props.selected_quizzes = page === 'self' ? data.quizzes.map(({ _id }) => _id) : [];
			else if (resource === 'question') {
				common_props.defaultType = data.type;
				common_props.selected_quiz = data.quiz ? data.quiz._id : '';
				common_props.defaultAnswers = data.answers;
				common_props.blank_count = data.type === 'FIB' ? data.name.match(/\$\{_\}/g).length : 0;
				common_props.defaultOptions = data.options;
			} else if (resource === 'quiz') {
				common_props.tags = data.tags;
				common_props.src = data.image;
				common_props.selected_folders = page === 'self' ? data.folders.map(({ _id }) => _id) : [];
			}
		}
		if (resource === 'folder') return <FolderForm {...common_props} />;
		else if (resource === 'question') return <QuestionForm {...common_props} />;
		else if (resource === 'quiz') return <QuizForm {...common_props} />;
		else if (resource === 'environment') return <EnvironmentForm {...common_props} />;
	};

	const { isOpen, handleClose, useModal = true, onArrowClick } = props;

	return (
		<CustomSnackbars>
			{({ changeResponse }) => {
				GLOBAL.changeResponse = changeResponse;
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

export default FormFiller;
