import React, { Component } from 'react';
import InputForm from '../../components/Form/InputForm';
import CustomSlider from '../../components/Input/Slider';

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
	null,
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
	state = {
		value: [ 15, 120 ]
	};
	render() {
		inputs[2] = {
			type: 'component',
			component: (
				<CustomSlider
					min={15}
					max={120}
					key="time_slider"
					value={this.state.value}
					onChange={(e, value) => {
						this.setState({ value });
					}}
				/>
			)
		};
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
						setValues,
						slider: this.state.value
					});
				}}
			</InputForm>
		);
	}
}

export default PlaySettings;
