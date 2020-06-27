import React, { Component } from 'react';
import * as Yup from 'yup';
import InputForm from '../../components/Form/InputForm';
import axios from 'axios';
import MultiSelect from '../../components/Input/MultiSelect';
import FormHelperText from '@material-ui/core/FormHelperText';
import TagCreator from '../../RP/TagCreator';
import FileInput from '../../RP/FileInput';
import { isEqual } from 'lodash';

const validationSchema = Yup.object({
	name: Yup.string('Enter quiz name')
		.min(3, 'Name can not be less than 3 characters')
		.max(50, 'Name can not be more than 50 characters')
		.required('Quiz name is required'),
	subject: Yup.string('Enter quiz subject').required('Please provide a subject')
});

class QuizForm extends Component {
	state = {
		folders: [],
		loading: true,
		selected_folders: this.props.selected_folders || []
	};

	UNSAFE_componentWillReceiveProps(props) {
		let isAllSame = true;
		if (props.selected_folders) {
			isAllSame =
				Boolean(props.selected_folders) && props.selected_folders.length === this.state.selected_folders.length;
			isAllSame = isAllSame && isEqual([ ...this.state.selected_folders ].sort(), [ ...props.selected_folders ].sort());
		}
		if (!isAllSame) {
			this.setState({
				selected_folders: props.selected_folders
			});
		}
	}

	componentDidMount() {
		axios
			.get('http://localhost:5001/api/v1/folders/me?select=name&populate=false', {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
			})
			.then(({ data: { data: folders } }) => {
				this.setState({
					folders,
					loading: false
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}

	handleChange = (e) => {
		this.setState({
			selected_folders: e.target.value
		});
	};

	preSubmit = (FileInputState, tags, values) => {
		values.folders = this.state.selected_folders;
		values.tags = tags;
		const { src, type } = FileInputState;
		if (type === 'link') values.image = src;
		return [ values, true ];
	};

	postSubmit = (FileInputState, reset, { data }, operation) => {
		const { file, type } = FileInputState;
		if (type === 'upload' && file) {
			const fd = new FormData();
			fd.append('file', file, file.name);
			axios
				.put(`http://localhost:5001/api/v1/quizzes/${data.data._id}/photo`, fd, {
					headers: {
						'Content-Type': 'multipart/form-data',
						Authorization: `Bearer ${localStorage.getItem('token')}`
					}
				})
				.then((data) => {
					if (operation === 'create') {
						this.resetForm(reset, () => {
							setTimeout(() => {
								this.props.changeResponse(`Uploaded`, `Successsfully uploaded image for the quiz`, 'success');
							}, this.props.user.current_environment.notification_timing + 500);
						});
					}
				})
				.catch((err) => {
					if (operation === 'create') {
						this.resetForm(reset, () => {
							setTimeout(() => {
								this.props.changeResponse(`An error occurred`, err.response.data.error, 'error');
							}, this.props.user.current_environment.notification_timing + 500);
						});
					}
				});
		} else this.resetForm(reset, null);
	};

	resetForm = ({ resetFileInputState, resetTags, refetchTags }, cb) => {
		let { selected_folders } = this.state;
		if (this.props.user.current_environment.reset_on_success) {
			selected_folders = [];
			resetTags();
			resetFileInputState();
		}
		refetchTags();
		this.setState(
			{
				selected_folders
			},
			cb ? cb : () => {}
		);
	};

	render() {
		const { preSubmit, handleChange, postSubmit } = this;
		const { onSubmit, transformInputs, submitMsg, src, tags = [] } = this.props;
		const { folders, loading, selected_folders } = this.state;

		let defaultInputs = [
			{ name: 'name' },
			{ name: 'subject' },
			null,
			{ name: 'favourite', type: 'checkbox', defaultValue: false },
			{ name: 'public', type: 'checkbox', defaultValue: true },
			null
		];

		return (
			<FileInput src={src ? src : ''}>
				{({ FileInput, FileInputState, resetFileInputState }) => {
					return (
						<TagCreator tags={tags}>
							{({ tags, resetTags, TagCreator, refetchTags }) => {
								defaultInputs[2] = {
									name: 'source',
									siblings: [
										{
											type: 'component',
											component: TagCreator
										}
									]
								};
								if (transformInputs) defaultInputs = transformInputs(defaultInputs);
								defaultInputs[5] = {
									type: 'component',
									name: 'select_folder',
									component: loading ? (
										<FormHelperText key={'select_folder'}>Loading your folders</FormHelperText>
									) : folders.length === 0 ? (
										<FormHelperText key={'select_folder'}>You have not created any folders yet</FormHelperText>
									) : (
										<MultiSelect
											key={'select_folder'}
											label={'Folders'}
											selected={selected_folders}
											handleChange={handleChange}
											items={folders}
										/>
									)
								};
								return (
									<div className="create_quiz create_form">
										<InputForm
											submitMsg={submitMsg}
											inputs={defaultInputs}
											validationSchema={validationSchema}
											onSubmit={onSubmit.bind(null, [
												'quiz',
												preSubmit.bind(null, FileInputState, tags),
												postSubmit.bind(null, FileInputState, { resetFileInputState, resetTags, refetchTags })
											])}
										/>
										{FileInput}
									</div>
								);
							}}
						</TagCreator>
					);
				}}
			</FileInput>
		);
	}
}

export default QuizForm;
