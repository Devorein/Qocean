import React, { Component } from 'react';
import * as Yup from 'yup';
import axios from 'axios';
import InputForm from '../../components/Form/InputForm';
import FormHelperText from '@material-ui/core/FormHelperText';
import MultiSelect from '../../components/MultiSelect/MultiSelect';
import getColoredIcons from '../../Utils/getColoredIcons';

const validationSchema = Yup.object({
	name: Yup.string('Enter folder name').required('Folder name is required'),
	icon: Yup.string('Enter folder icon'),
	favourite: Yup.bool().default(false),
	public: Yup.bool().default(true)
});

class FolderForm extends Component {
	state = {
		folders: [],
		loading: true,
		selected_quizzes: [],
		quizzes: []
	};
	componentDidMount() {
		axios
			.get('http://localhost:5001/api/v1/quizzes/me?select=name&populate=false', {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
			})
			.then(({ data: { data: quizzes } }) => {
				this.setState({
					quizzes,
					loading: false
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}

	handleChange = (e) => {
		this.setState({
			selected_quizzes: e.target.value
		});
	};

	preSubmit = (values) => {
		values.quizzes = this.state.selected_quizzes;
		return [ values, true ];
	};

	postSubmit = () => {
		this.setState({
			selected_quizzes: []
		});
	};

	render() {
		const { preSubmit, handleChange, postSubmit } = this;
		const { onSubmit, customInputs, submitMsg } = this.props;
		const { quizzes, loading, selected_quizzes } = this.state;

		let defaultInputs = [
			{ name: 'name' },
			{
				name: 'icon',
				type: 'select',
				extra: {
					selectItems: [ 'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'purple' ].map((color) => {
						const capitalized = color.charAt(0).toUpperCase() + color.substr(1);
						return {
							text: capitalized,
							value: `${capitalized}_folder.svg`,
							icon: getColoredIcons('Folder', color)
						};
					})
				},
				defaultValue: 'Red_folder.svg'
			},
			{ name: 'favourite', label: 'Favourite', type: 'checkbox', defaultValue: false },
			{ name: 'public', label: 'Public', type: 'checkbox', defaultValue: true }
		];

		if (customInputs) defaultInputs = customInputs(defaultInputs);

		return (
			<div className="create_folder create_form">
				<InputForm
					submitMsg={submitMsg}
					inputs={defaultInputs}
					validationSchema={validationSchema}
					onSubmit={onSubmit.bind(null, [ 'folder', preSubmit, postSubmit ])}
				>
					{loading ? (
						<FormHelperText>Loading your quizzes</FormHelperText>
					) : quizzes.length < 1 ? (
						<FormHelperText>Loading your quizzes</FormHelperText>
					) : (
						<MultiSelect label={'Quizzes'} selected={selected_quizzes} handleChange={handleChange} items={quizzes} />
					)}
				</InputForm>
			</div>
		);
	}
}

export default FolderForm;
