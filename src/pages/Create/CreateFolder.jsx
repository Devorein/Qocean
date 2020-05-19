import React, { Component } from 'react';
import * as Yup from 'yup';
import axios from 'axios';
import InputForm from '../../components/Form/InputForm';
import FolderIcon from '@material-ui/icons/Folder';
import { red, blue, indigo, green, orange, yellow, purple } from '@material-ui/core/colors';
import FormHelperText from '@material-ui/core/FormHelperText';
import MultiSelect from '../../components/MultiSelect/MultiSelect';

const validationSchema = Yup.object({
	name: Yup.string('Enter folder name').required('Folder name is required'),
	icon: Yup.string('Enter folder icon'),
	favourite: Yup.bool().default(false),
	public: Yup.bool().default(true)
});

class CreateFolder extends Component {
	state = {
		folders: [],
		loading: true,
		selected_quizzes: []
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

	render() {
		const { onSubmit } = this.props;
		const { quizzes, loading, selected_quizzes } = this.state;

		const inputs = [
			{ name: 'name' },
			{
				name: 'icon',
				type: 'select',
				selectItems: [
					{
						text: 'Red',
						value: 'Red_folder.svg',
						icon: <FolderIcon style={{ fill: red[500] }} />
					},
					{
						text: 'Orange',
						value: 'Orange_folder.svg',
						icon: <FolderIcon style={{ fill: orange[500] }} />
					},
					{
						text: 'Yellow',
						value: 'Yellow_folder.svg',
						icon: <FolderIcon style={{ fill: yellow[500] }} />
					},
					{
						text: 'Green',
						value: 'Green_folder.svg',
						icon: <FolderIcon style={{ fill: green[500] }} />
					},
					{
						text: 'Blue',
						value: 'Blue_folder.svg',
						icon: <FolderIcon style={{ fill: blue[500] }} />
					},
					{
						text: 'Indigo',
						value: 'Indigo_folder.svg',
						icon: <FolderIcon style={{ fill: indigo[500] }} />
					},
					{
						text: 'Violet',
						value: 'Violet_folder.svg',
						icon: <FolderIcon style={{ fill: purple[500] }} />
					}
				],
				defaultValue: 'Red_folder.svg'
			},
			{ name: 'favourite', label: 'Favourite', type: 'checkbox', defaultValue: false },
			{ name: 'public', label: 'Public', type: 'checkbox', defaultValue: true }
		];
		return (
			<div>
				<InputForm inputs={inputs} validationSchema={validationSchema} onSubmit={onSubmit}>
					{loading ? (
						<FormHelperText>Loading your quizzes</FormHelperText>
					) : quizzes.length < 1 ? (
						<FormHelperText>Loading your quizzes</FormHelperText>
					) : (
						<MultiSelect
							label={'Quizzes'}
							selected={selected_quizzes}
							handleChange={this.handleChange}
							items={quizzes}
						/>
					)}
				</InputForm>
			</div>
		);
	}
}

export default CreateFolder;
