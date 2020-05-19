import React, { Component } from 'react';
import * as Yup from 'yup';
import InputForm from '../../components/Form/InputForm';
import { red, blue, indigo, green, orange, yellow, purple } from '@material-ui/core/colors';
import SettingsIcon from '@material-ui/icons/Settings';

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
						value: 'Red_env.svg',
						icon: <SettingsIcon style={{ fill: red[500] }} />
					},
					{
						text: 'Orange',
						value: 'Orange_env.svg',
						icon: <SettingsIcon style={{ fill: orange[500] }} />
					},
					{
						text: 'Yellow',
						value: 'Yellow_env.svg',
						icon: <SettingsIcon style={{ fill: yellow[500] }} />
					},
					{
						text: 'Green',
						value: 'Green_env.svg',
						icon: <SettingsIcon style={{ fill: green[500] }} />
					},
					{
						text: 'Blue',
						value: 'Blue_env.svg',
						icon: <SettingsIcon style={{ fill: blue[500] }} />
					},
					{
						text: 'Indigo',
						value: 'Indigo_env.svg',
						icon: <SettingsIcon style={{ fill: indigo[500] }} />
					},
					{
						text: 'Violet',
						value: 'Violet_env.svg',
						icon: <SettingsIcon style={{ fill: purple[500] }} />
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
