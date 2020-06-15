import React, { Component } from 'react';
import InputForm from '../../components/Form/InputForm';

const inputs = [
	{ name: 'session_name', defaultValue: Date.now().toString() },
	{
		name: 'validation',
		type: 'select',
		extra: {
			selectItems: [
				{
					text: 'After every question',
					value: 'instant'
				},
				{
					text: 'End of session',
					value: 'end'
				}
			]
		},
		defaultValue: 'end'
	},
	{
		name: 'disable_by_time_allocated',
		type: 'slider',
		defaultValue: [ 15, 60 ]
	},
	{
		name: 'disable_by_difficulty',
		type: 'group',
		extra: { treeView: true },
		children: [ 'Beginner', 'Intermediate', 'Advanced' ].map((item) => {
			return {
				name: item,
				type: 'checkbox',
				defaultValue: false
			};
		})
	},
	{
		name: 'disable_by_type',
		type: 'group',
		extra: { treeView: true },
		children: [ 'MCQ', 'MS', 'TF', 'Snippet', 'FC', 'FIB' ].map((item) => {
			return {
				name: item,
				type: 'checkbox',
				defaultValue: false
			};
		})
	},
	{
		name: 'randomize',
		type: 'group',
		extra: { treeView: true },
		children: [
			{
				type: 'checkbox',
				name: 'randomized_quiz',
				defaultValue: false
			},
			{
				type: 'checkbox',
				name: 'randomized_question',
				defaultValue: false
			},
			{
				type: 'checkbox',
				name: 'randomized_options',
				defaultValue: false
			}
		]
	}
];

class PlaySettings extends Component {
	render() {
		return (
			<InputForm formButtons={false} inputs={inputs} passFormAsProp>
				{({ setValues, values, errors, isValid, inputs }) => {
					return this.props.children({
						formData: {
							values,
							errors,
							isValid
						},
						inputs: <div className="play_settings">{inputs}</div>,
						setValues
					});
				}}
			</InputForm>
		);
	}
}

export default PlaySettings;
