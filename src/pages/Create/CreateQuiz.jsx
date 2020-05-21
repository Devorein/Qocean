import React, { Component } from 'react';
import * as Yup from 'yup';
import InputForm from '../../components/Form/InputForm';
import axios from 'axios';
import MultiSelect from '../../components/MultiSelect/MultiSelect';
import FormHelperText from '@material-ui/core/FormHelperText';
import ChipContainer from '../../components/Chip/ChipContainer';
import validateColor from 'validate-color';

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
		return values;
	};

	postSubmit = (cond) => {
		if (cond) {
			this.setState({
				selected_folders: []
			});
		}
	};

	deleteTags = (_tag) => {
		let { tags } = this.state;
		tags = tags.filter((tag) => tag.split(':')[0].toLowerCase() !== _tag.toLowerCase());
		this.setState({
			tags
		});
	};

	validateTags = (changeResponse, _tag) => {
		const { tags } = this.state;
		const isPresent = tags.find((tag) => tag.split(':')[0].toLowerCase() === _tag.split(':')[0].toLowerCase());
		const tagsSeparator = _tag.split(':');
		if (tagsSeparator.length === 1) {
			changeResponse(`You've entered a partial tag, using default color`, 'warning');
			return true;
		} else if (tagsSeparator[1] === '') {
			changeResponse(`You've not supplied a color, using default color`, 'warning');
			return true;
		} else if (!validateColor(tagsSeparator[1])) {
			changeResponse(`You've supplied an invalid color`, 'error');
			return false;
		} else if (tagsSeparator.length > 2) {
			changeResponse(`Your tag is malformed, check it again`, 'error');
			return false;
		}
		if (isPresent) {
			changeResponse(`Tag with name ${_tag.split(':')[0]} has already been added`, 'error');
			return false;
		} else return true;
	};

	createTags = (changeResponse, e) => {
		e.persist();
		if (e.key === 'Enter') {
			e.preventDefault();
			const { tags } = this.state;
			if (this.validateTags(changeResponse, e.target.value)) {
				tags.push(e.target.value);
				e.target.value = '';
				this.setState({
					tags
				});
			}
		}
	};

	render() {
		const { preSubmit, handleChange, createTags, deleteTags, postSubmit } = this;
		const { onSubmit, changeResponse } = this.props;
		const { folders, loading, selected_folders, tags } = this.state;
		const inputs = [
			{ name: 'name' },
			{ name: 'subject' },
			{ name: 'source' },
			{ name: 'image' },
			{
				name: 'tags',
				controlled: false,
				onkeyPress: createTags.bind(null, changeResponse),
				sibling: <ChipContainer chips={tags} type="delete" onIconClick={deleteTags} />
			},
			{ name: 'favourite', type: 'checkbox', defaultValue: false },
			{ name: 'public', type: 'checkbox', defaultValue: true }
		];

		return (
			<div>
				<InputForm
					inputs={inputs}
					validationSchema={validationSchema}
					onSubmit={onSubmit.bind(null, [ changeResponse, preSubmit, postSubmit ])}
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
