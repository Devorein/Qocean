import React, { Component } from 'react';
import * as Yup from 'yup';
import InputForm from '../../components/Form/InputForm';
import axios from 'axios';
import MultiSelect from '../../components/MultiSelect/MultiSelect';
import FormHelperText from '@material-ui/core/FormHelperText';
import ChipContainer from '../../components/Chip/ChipContainer';
import validateColor from 'validate-color';
import FileInput from '../../components/Input/FileInput';

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
		folders: [],
		loading: true,
		selected_folders: [],
		tags: []
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
		const [ file, src ] = this.refs.FileInput.returnData();
		if (file) values.link = '';
		else values.link = src;
		return values;
	};

	resetForm = (cb) => {
		let { selected_folders, tags } = this.state;
		if (this.props.user.current_environment.reset_on_success) {
			selected_folders = [];
			tags = [];
			this.refs.FileInput.resetData();
		}
		this.setState(
			{
				selected_folders,
				tags
			},
			cb
		);
	};

	postSubmit = ({ data }) => {
		const fd = new FormData();
		const [ file ] = this.refs.FileInput.returnData();
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
						}, this.props.user.current_environment.notification_timing);
					});
				})
				.catch((err) => {
					this.resetForm(() => {
						setTimeout(() => {
							this.props.changeResponse(`An error occurred`, err.response.data.error, 'error');
						}, this.props.user.current_environment.notification_timing);
					});
				});
		} else this.resetForm(null);
	};

	deleteTags = (_tag) => {
		let { tags } = this.state;
		tags = tags.filter((tag) => tag.split(':')[0].toLowerCase() !== _tag.toLowerCase());
		this.setState({
			tags
		});
	};

	validateTags = (_tag) => {
		const { changeResponse } = this.props;
		const { tags } = this.state;
		const isPresent = tags.find((tag) => tag.split(':')[0].toLowerCase() === _tag.split(':')[0].toLowerCase());
		const tagsSeparator = _tag.split(':');
		if (tags.length >= 5) {
			changeResponse(`An error occurred`, `You've added the maximum number of tags`, 'error');
			return false;
		} else if (tagsSeparator[0].length >= 16) {
			changeResponse(`An error occurred`, `You cant add a tag that's more than 16 characters long`, 'error');
			return false;
		} else if (tagsSeparator.length === 1) {
			changeResponse(`An error occurred`, `You've entered a partial tag, using default color`, 'warning');
			return true;
		} else if (tagsSeparator[1] === '') {
			changeResponse(`An error occurred`, `You've not supplied a color, using default color`, 'warning');
			return true;
		} else if (!validateColor(tagsSeparator[1])) {
			changeResponse(`An error occurred`, `You've supplied an invalid color`, 'error');
			return false;
		} else if (tagsSeparator.length > 2) {
			changeResponse(`An error occurred`, `Your tag is malformed, check it again`, 'error');
			return false;
		}
		if (isPresent) {
			changeResponse(
				`An error occurred`,
				`Tag with name ${_tag.split(':')[0].toLowerCase()} has already been added`,
				'error'
			);
			return false;
		} else return true;
	};

	createTags = (e) => {
		e.persist();
		if (e.key === 'Enter') {
			e.preventDefault();
			const { tags } = this.state;
			if (this.validateTags(e.target.value)) {
				tags.push(e.target.value.toLowerCase());
				e.target.value = '';
				this.setState({
					tags
				});
			}
		}
	};

	render() {
		const { preSubmit, handleChange, createTags, deleteTags, postSubmit } = this;
		const { onSubmit } = this.props;
		const { folders, loading, selected_folders, tags, image } = this.state;

		const inputs = [
			{ name: 'name' },
			{ name: 'subject' },
			{
				name: 'source'
			},
			{
				name: 'tags',
				controlled: false,
				onkeyPress: createTags,
				siblings: [
					{
						type: 'component',
						component: <ChipContainer key={'chip_container'} chips={tags} type="delete" onIconClick={deleteTags} />
					}
				]
			},
			{ name: 'favourite', type: 'checkbox', defaultValue: false },
			{ name: 'public', type: 'checkbox', defaultValue: true }
		];

		return (
			<div className="create_quiz create_form">
				<InputForm
					inputs={inputs}
					validationSchema={validationSchema}
					onSubmit={onSubmit.bind(null, [ preSubmit, postSubmit ])}
				>
					{loading ? (
						<FormHelperText>Loading your folders</FormHelperText>
					) : folders.length < 1 ? (
						<FormHelperText>Loading your folders</FormHelperText>
					) : (
						<MultiSelect label={'Folders'} selected={selected_folders} handleChange={handleChange} items={folders} />
					)}
				</InputForm>
				<FileInput ref="FileInput" />
			</div>
		);
	}
}

export default CreateQuiz;
