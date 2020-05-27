import React, { Component } from 'react';
import * as Yup from 'yup';
import InputForm from '../../components/Form/InputForm';
import axios from 'axios';
import MultiSelect from '../../components/MultiSelect/MultiSelect';
import FormHelperText from '@material-ui/core/FormHelperText';
import FileInput from '../../components/Input/FileInput';
import TagCreator from '../../components/Chip/TagCreator';

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

class CreateQuiz extends Component {
	state = {
		tags: this.props.tags || [],
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

	preSubmit = (values) => {
		values.folders = this.state.selected_folders;
		values.tags = this.state.tags;
		// const [ file, src ] = this.FileInput.state;
		// if (file) values.link = '';
		// else values.link = src;
		return [ values, true ];
	};

	resetForm = (cb) => {
		let { selected_folders, tags } = this.state;
		if (this.props.user.current_environment.reset_on_success) {
			selected_folders = [];
			tags = [];
			this.FileInput.resetData();
		}
		this.setState(
			{
				selected_folders,
				tags
			},
			cb ? cb : () => {}
		);
	};

	postSubmit = ({ data }) => {
		const fd = new FormData();
		const [ file ] = this.FileInput.state;
		if (file) {
			fd.append('file', file, file.name);
			axios
				.put(`http://localhost:5001/api/v1/quizzes/${data.data._id}/photo`, fd, {
					headers: {
						'Content-Type': 'multipart/form-data',
						Authorization: `Bearer ${localStorage.getItem('token')}`
					}
				})
				.then((data) => {
					this.resetForm(() => {
						setTimeout(() => {
							this.props.changeResponse(`Uploaded`, `Successsfully uploaded image for the quiz`, 'success');
						}, this.props.user.current_environment.notification_timing + 500);
					});
				})
				.catch((err) => {
					this.resetForm(() => {
						setTimeout(() => {
							this.props.changeResponse(`An error occurred`, err.response.data.error, 'error');
						}, this.props.user.current_environment.notification_timing + 500);
					});
				});
		} else this.resetForm(null);
	};

	render() {
		const { preSubmit, handleChange, postSubmit } = this;
		const { onSubmit, customInputs, submitMsg, image_link } = this.props;
		const { folders, loading, selected_folders } = this.state;

		let defaultInputs = [
			{ name: 'name' },
			{ name: 'subject' },
			{
				name: 'source',
				siblings: [
					{
						type: 'component',
						component: (
							<TagCreator
								key={'tag_creator'}
								tags={this.state.tags}
								setTags={(tags) => {
									this.setState({
										tags
									});
								}}
							/>
						)
					}
				]
			},
			{ name: 'favourite', type: 'checkbox', defaultValue: false },
			{ name: 'public', type: 'checkbox', defaultValue: true }
		];

		if (customInputs) defaultInputs = customInputs(defaultInputs);
		return (
			<div className="create_quiz create_form">
				<InputForm
					submitMsg={submitMsg}
					inputs={defaultInputs}
					validationSchema={validationSchema}
					onSubmit={onSubmit.bind(null, [ 'quiz', preSubmit, postSubmit ])}
					ref={(r) => (this.InputForm = r)}
				>
					{loading ? (
						<FormHelperText>Loading your folders</FormHelperText>
					) : folders.length < 1 ? (
						<FormHelperText>Loading your folders</FormHelperText>
					) : (
						<MultiSelect label={'Folders'} selected={selected_folders} handleChange={handleChange} items={folders} />
					)}
				</InputForm>
				<FileInput
					ref={(r) => {
						this.FileInput = r;
						if (this.FileInput) {
							if (image_link)
								this.FileInput.setState({
									image: 'link',
									src: image_link
								});
						}
					}}
				/>
			</div>
		);
	}
}

export default CreateQuiz;
