import React, { Component } from 'react';
import * as Yup from 'yup';
import InputForm from '../../components/Form/InputForm';
import getColoredIcons from '../../Utils/getColoredIcons';

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
				extra: {
					selectItems: [ 'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'purple' ].map((color) => {
						const capitalized = color.charAt(0).toUpperCase() + color.substr(1);
						return {
							text: capitalized,
							value: `${capitalized}_env.svg`,
							icon: getColoredIcons('Settings', color)
						};
					})
				},
				defaultValue: 'Red_env.svg'
			},
			{ name: 'animation', type: 'checkbox', defaultValue: true },
			{ name: 'sound', type: 'checkbox', defaultValue: true },
			{
				type: 'group',
				name: 'environment',
				treeView: true,
				children: [
					{ name: 'favourite', type: 'checkbox', defaultValue: false },
					{ name: 'public', type: 'checkbox', defaultValue: true },
					{ name: 'set_as_current', type: 'checkbox', defaultValue: true }
				]
			},
			{ name: 'reset_on_success', type: 'checkbox', defaultValue: true },
			{ name: 'reset_on_error', type: 'checkbox', defaultValue: false },
			{
				type: 'group',
				name: 'questions_group',
				treeView: true,
				children: [
					{
						name: 'default_question_type',
						type: 'select',
						extra: {
							selectItems: [
								{ text: 'Fill In the Blanks', value: 'FIB' },
								{ text: 'Multiple Choice', value: 'MCQ' },
								{ text: 'Multiple Select', value: 'MS' },
								{ text: 'Snippet', value: 'Snippet' },
								{ text: 'Flashcard', value: 'FC' },
								{ text: 'True/False', value: 'TF' }
							]
						},
						defaultValue: 'MCQ'
					},
					{
						name: 'default_question_difficulty',
						type: 'select',
						extra: {
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
							]
						},
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
					}
				]
			},
			{
				name: 'theme',
				type: 'select',
				extra: {
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
					]
				},
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
			<div className="create_env create_form">
				<InputForm inputs={inputs} validationSchema={validationSchema} onSubmit={onSubmit.bind(null, [])} />
			</div>
		);
	}
}

export default CreateEnvironment;
