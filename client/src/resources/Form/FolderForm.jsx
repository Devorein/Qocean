import React, { Component } from 'react';
import * as Yup from 'yup';
import axios from 'axios';
import InputForm from '../../components/Form/InputForm';
import FormHelperText from '@material-ui/core/FormHelperText';
import MultiSelect from '../../components/Input/MultiSelect';
import getColoredIcons from '../../Utils/getColoredIcons';
import { isEqual } from 'lodash';

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
		selected_quizzes: this.props.selected_quizzes || [],
		quizzes: []
	};

	UNSAFE_componentWillReceiveProps (props) {
		let isAllSame = true;
		if (props.selected_quizzes) {
			if (props.selected_quizzes.length !== this.state.selected_quizzes.length) isAllSame = false;
			isAllSame = isAllSame && isEqual([ ...this.state.selected_quizzes ].sort(), [ ...props.selected_quizzes ].sort());
			if (!isAllSame) {
				this.setState({
					selected_quizzes: props.selected_quizzes
				});
			}
		}
	}

	componentDidMount () {
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

	postSubmit = (data, operation) => {
		if (operation === 'Create') {
			this.setState({
				selected_quizzes: []
			});
		}
	};

	render () {
		const { preSubmit, handleChange, postSubmit } = this;
		const { onSubmit, transformInputs, submitMsg } = this.props;
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
							value: `${capitalized}_folder`,
							icon: getColoredIcons('Folder', color)
						};
					})
				},
				defaultValue: 'Red_folder'
			},
			{ name: 'favourite', label: 'Favourite', type: 'checkbox', defaultValue: false },
			{ name: 'public', label: 'Public', type: 'checkbox', defaultValue: true },
			{
				type: 'component',
				name: 'quizzes',
				component: loading ? (
					<FormHelperText key={'quizzes'}>Loading your quizzes</FormHelperText>
				) : quizzes.length < 1 ? (
					<FormHelperText key={'quizzes'}>You have not created any quizzes yet</FormHelperText>
				) : (
					<MultiSelect
						key={'quizzes'}
						label={'Quizzes'}
						selected={selected_quizzes}
						handleChange={handleChange}
						items={quizzes}
					/>
				)
			}
		];

		if (transformInputs) defaultInputs = transformInputs(defaultInputs);

		return (
			<div className="create_folder create_form">
				<InputForm
					submitMsg={submitMsg}
					inputs={defaultInputs}
					validationSchema={validationSchema}
					onSubmit={onSubmit.bind(null, [ 'folder', preSubmit, postSubmit ])}
				/>
			</div>
		);
	}
}

export default FolderForm;
