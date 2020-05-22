import React, { Component } from 'react';
import * as Yup from 'yup';
import InputForm from '../../components/Form/InputForm';
import axios from 'axios';
import MultiSelect from '../../components/MultiSelect/MultiSelect';
import UploadButton from '../../components/Buttons/UploadButton';
import FormHelperText from '@material-ui/core/FormHelperText';
import CustomTabs from '../../components/Tab/Tabs';
import ChipContainer from '../../components/Chip/ChipContainer';
import validateColor from 'validate-color';
import LinkIcon from '@material-ui/icons/Link';
import PublishIcon from '@material-ui/icons/Publish';

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
		tags: [],
		image: 'link',
		file: null
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
		if (this.state.file) values.link = '';
		return values;
	};

	postSubmit = ({ data }) => {
		const fd = new FormData();
		if (this.state.file) {
			fd.append('file', this.state.file, this.state.file.name);
			axios
				.put(`http://localhost:5001/api/v1/quizzes/${data.data._id}/photo`, fd, {
					headers: {
						'Content-Type': 'multipart/form-data',
						Authorization: `Bearer ${localStorage.getItem('token')}`
					}
				})
				.then((data) => {
					console.log(data);
				})
				.catch((err) => {
					console.log(err);
				});
		}
		// if (cond) {
		// 	this.setState({
		// 		selected_folders: []
		// 	});
		// }
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
		if (tagsSeparator.length === 1) {
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
			changeResponse(`An error occurred`, `Tag with name ${_tag.split(':')[0]} has already been added`, 'error');
			return false;
		} else return true;
	};

	createTags = (e) => {
		e.persist();
		if (e.key === 'Enter') {
			e.preventDefault();
			const { tags } = this.state;
			if (this.validateTags(e.target.value)) {
				tags.push(e.target.value);
				e.target.value = '';
				this.setState({
					tags
				});
			}
		}
	};

	switchImageHandler = (value) => {
		this.setState({
			image: value.name
		});
	};

	setFile = (e) => {
		e.persist();
		const { files: [ file ] } = e.target;
		this.setState({
			file
		});
	};

	render() {
		const { preSubmit, handleChange, createTags, deleteTags, postSubmit, switchImageHandler, setFile } = this;
		const { onSubmit } = this.props;
		const { folders, loading, selected_folders, tags, image } = this.state;

		const headers = [ { name: 'link', icon: <LinkIcon /> }, { name: 'upload', icon: <PublishIcon /> } ];

		const index = headers.findIndex(({ name }) => name === this.state.image);

		const inputs = [
			{ name: 'name' },
			{ name: 'subject' },
			{
				name: 'source',
				sibling: (
					<CustomTabs
						value={index === -1 ? 0 : index}
						onChange={(e, value) => {
							switchImageHandler(headers[value]);
						}}
						indicatorColor="primary"
						textColor="primary"
						centered
						headers={headers}
					/>
				)
			},
			image === 'link'
				? { name: 'link' }
				: { type: 'component', component: <UploadButton key={'upload'} setFile={setFile} /> },
			{
				name: 'tags',
				controlled: false,
				onkeyPress: createTags,
				sibling: <ChipContainer chips={tags} type="delete" onIconClick={deleteTags} />
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
			</div>
		);
	}
}

export default CreateQuiz;
