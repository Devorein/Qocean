import React, { Component } from 'react';
import * as Yup from 'yup';
import InputForm from '../../components/Form/InputForm';

const validationSchema = Yup.object({
	name: Yup.string('Enter folder name').required('Folder name is required'),
	icon: Yup.string('Enter folder icon'),
	favourite: Yup.bool().default(false),
	public: Yup.bool().default(true)
});

class CreateFolder extends Component {
	render() {
		const { onSubmit } = this.props;
		const inputs = [
			{ name: 'name' },
			{
				name: 'icon',
				type: 'select',
				selectItems: [
					{
						text: 'Red',
						value: 'Red_folder.svg'
					},
					{
						text: 'Orange',
						value: 'Orange_folder.svg'
					},
					{
						text: 'Yellow',
						value: 'Yellow_folder.svg'
					},
					{
						text: 'Green',
						value: 'Green_folder.svg'
					},
					{
						text: 'Blue',
						value: 'Blue_folder.svg'
					},
					{
						text: 'Indigo',
						value: 'Indigo_folder.svg'
					},
					{
						text: 'Violet',
						value: 'Violet_folder.svg'
					}
				],
				defaultValue: 'Red_folder.svg'
			},
			{ name: 'favourite', label: 'Favourite', type: 'checkbox', defaultValue: false },
			{ name: 'public', label: 'Public', type: 'checkbox', defaultValue: true }
		];
		return (
			<div>
				<InputForm inputs={inputs} validationSchema={validationSchema} onSubmit={onSubmit} />
			</div>
		);
	}
}

export default CreateFolder;
