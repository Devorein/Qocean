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
		const { onSubmit, changeResponse } = this.props;

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
			{ name: 'reset_on_success', type: 'checkbox', defaultValue: true },
			{ name: 'reset_on_error', type: 'checkbox', defaultValue: false },
			{ name: 'set_as_current', type: 'checkbox', defaultValue: true },
			{
				name: 'default_question_type',
				type: 'select',
				selectItems: [
					{ text: 'Fill In the Blanks', value: 'FIB' },
					{ text: 'Multiple Choice', value: 'MCQ' },
					{ text: 'Multiple Select', value: 'MS' },
					{ text: 'Snippet', value: 'Snippet' },
					{ text: 'Flashcard', value: 'FC' },
					{ text: 'True/False', value: 'TF' }
				],
				defaultValue: 'MCQ'
			},
			{
				name: 'default_question_difficulty',
				type: 'select',
				selectItems: [
					{
						text: 'Beginner'
					},
					{
						text: 'Intermediate'
					},
					{
						text: 'Advanced'
					}
				],
				defaultValue: 'Beginner'
			},
			{
				name: 'default_question_timing',
				type: 'number',
				inputProps: {
					min: 15,
					max: 120,
					step: 5
				},
				defaultValue: 30
			},
			{
				name: 'default_question_weight',
				type: 'number',
				inputProps: {
					min: 1,
					max: 10,
					step: 1
				},
				defaultValue: 1
			},
			{
				name: 'theme',
				type: 'select',
				selectItems: [
					{
						text: 'Light'
					},
					{
						text: 'Dark'
					},
					{
						text: 'Navy'
					}
				],
				defaultValue: 'Light'
			},

			{
				name: 'notification_timing',
				type: 'number',
				inputProps: {
					min: 1000,
					max: 5000,
					step: 250
				},
				defaultValue: 2500
			}
		];
		return (
			<div>
				<InputForm
					inputs={inputs}
					validationSchema={validationSchema}
					onSubmit={onSubmit.bind(null, [ changeResponse ])}
				/>
			</div>
		);
	}
}

export default CreateEnvironment;
