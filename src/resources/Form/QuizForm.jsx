import React, { Component } from 'react';
import * as Yup from 'yup';
import InputForm from '../../components/Form/InputForm';
import axios from 'axios';
import MultiSelect from '../../components/MultiSelect/MultiSelect';
import FormHelperText from '@material-ui/core/FormHelperText';
import TagCreatorRP from '../../RP/TagCreatorRP';
import FileInputRP from '../../RP/FileInputRP';

const validationSchema = Yup.object({
	name: Yup.string('Enter quiz name')
		.min(3, 'Name can not be less than 3 characters')
		.max(50, 'Name can not be more than 50 characters')
		.required('Quiz name is required'),
	subject: Yup.string('Enter quiz subject').required('Please provide a subject'),
	source: Yup.string('Enter quiz source'),
	image: Yup.string('Enter quiz image'),
	favourite: Yup.bool().default(false),
	public: Yup.bool().default(true),
	folder: Yup.string('Enter folder')
});

class QuizForm extends Component {
	state = {
		folders: [],
		loading: true,
		selected_folders: []
	};

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

	preSubmit = (getFileData, tags, values) => {
		values.folders = this.state.selected_folders;
		values.tags = tags;
		const { src, image } = getFileData();
		if (image === 'link') values.image = src;
		return [ values, true ];
	};

	resetForm = ({ resetFileInput, resetTags }, cb) => {
		let { selected_folders } = this.state;
		if (this.props.user.current_environment.reset_on_success) {
			selected_folders = [];
			resetTags();
			resetFileInput();
		}
		this.setState(
			{
				selected_folders
			},
			cb ? cb : () => {}
		);
	};

	postSubmit = (getFileData, reset, { data }) => {
		const fd = new FormData();
		const { file, image } = getFileData();
		if (image === 'upload' && file) {
			fd.append('file', file, file.name);
			axios
				.put(`http://localhost:5001/api/v1/quizzes/${data.data._id}/photo`, fd, {
					headers: {
						'Content-Type': 'multipart/form-data',
						Authorization: `Bearer ${localStorage.getItem('token')}`
					}
				})
				.then((data) => {
					this.resetForm(reset, () => {
						setTimeout(() => {
							this.props.changeResponse(`Uploaded`, `Successsfully uploaded image for the quiz`, 'success');
						}, this.props.user.current_environment.notification_timing + 500);
					});
				})
				.catch((err) => {
					this.resetForm(reset, () => {
						setTimeout(() => {
							this.props.changeResponse(`An error occurred`, err.response.data.error, 'error');
						}, this.props.user.current_environment.notification_timing + 500);
					});
				});
		} else this.resetForm(reset, null);
	};

	render() {
		const { preSubmit, handleChange, postSubmit } = this;
		const { onSubmit, customInputs, submitMsg, image_link, tags = [] } = this.props;
		const { folders, loading, selected_folders } = this.state;

		let defaultInputs = [
			{ name: 'name' },
			{ name: 'subject' },
			null,
			{ name: 'favourite', type: 'checkbox', defaultValue: false },
			{ name: 'public', type: 'checkbox', defaultValue: true }
		];

		return (
			<FileInputRP src={image_link}>
				{({ getFileData, FileInput, resetFileInput }) => {
					return (
						<TagCreatorRP tags={tags}>
							{({ tags, resetTags, tagCreator }) => {
								defaultInputs[2] = {
									name: 'source',
									siblings: [
										{
											type: 'component',
											component: tagCreator
										}
									]
								};
								if (customInputs) defaultInputs = customInputs(defaultInputs);
								return (
									<div className="create_quiz create_form">
										<InputForm
											submitMsg={submitMsg}
											inputs={defaultInputs}
											validationSchema={validationSchema}
											onSubmit={onSubmit.bind(null, [
												'quiz',
												preSubmit.bind(null, getFileData, tags),
												postSubmit.bind(null, getFileData, { resetFileInput, resetTags })
											])}
											ref={(r) => (this.InputForm = r)}
										>
											{loading ? (
												<FormHelperText>Loading your folders</FormHelperText>
											) : folders.length < 1 ? (
												<FormHelperText>Loading your folders</FormHelperText>
											) : (
												<MultiSelect
													label={'Folders'}
													selected={selected_folders}
													handleChange={handleChange}
													items={folders}
												/>
											)}
										</InputForm>
										{FileInput}
									</div>
								);
							}}
						</TagCreatorRP>
					);
				}}
			</FileInputRP>
		);
	}
}

export default QuizForm;
