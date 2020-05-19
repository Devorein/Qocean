import React, { Component } from 'react';
import * as Yup from 'yup';
import InputForm from '../../components/Form/InputForm';

const validationSchema = Yup.object({
	name: Yup.string(`Enter environment name`).required(`environment name is required`),
	icon: Yup.string(`Enter environment icon`),
	animation: Yup.bool().default(true),
	sound: Yup.bool().default(true),
	favourite: Yup.bool().default(false),
	public: Yup.bool().default(true)
});

class CreateEnvironment extends Component {
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
						value: 'Red_env.svg'
					},
					{
						text: 'Orange',
						value: 'Orange_env.svg'
					},
					{
						text: 'Yellow',
						value: 'Yellow_env.svg'
					},
					{
						text: 'Green',
						value: 'Green_env.svg'
					},
					{
						text: 'Blue',
						value: 'Blue_env.svg'
					},
					{
						text: 'Indigo',
						value: 'Indigo_env.svg'
					},
					{
						text: 'Violet',
						value: 'Violet_env.svg'
					}
				],
				defaultValue: 'Red_env.svg'
			},
			{ name: 'animation', type: 'checkbox', defaultValue: true },
			{ name: 'sound', type: 'checkbox', defaultValue: true },
			{ name: 'favourite', type: 'checkbox', defaultValue: false },
			{ name: 'public', type: 'checkbox', defaultValue: true },
			{ name: 'reset_after_submit', type: 'checkbox', defaultValue: false }
		];
		return (
			<div>
				<InputForm inputs={inputs} validationSchema={validationSchema} onSubmit={onSubmit} />
			</div>
		);
	}
}

export default CreateEnvironment;
