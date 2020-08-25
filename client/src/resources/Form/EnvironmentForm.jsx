import React, { Component } from 'react';
import * as Yup from 'yup';
import InputForm from '../../components/Form/InputForm';
import getColoredIcons from '../../Utils/getColoredIcons';
import { validateHTMLColorHex } from 'validate-color';
import createEnvGroups from '../../Utils/createEnvGroups';

const validationSchema = Yup.object({
	name: Yup.string(`Enter environment name`).required(`environment name is required`),
	icon: Yup.string(`Enter environment icon`),
	animation: Yup.bool().default(true),
	sound: Yup.bool().default(true),
	favourite: Yup.bool().default(false),
	public: Yup.bool().default(true),
	primary_color: Yup.string().test('isHexOnly', 'Primary color can only be hex values', validateHTMLColorHex),
	secondary_color: Yup.string().test('isHexOnly', 'Secondary color can only be hex values', validateHTMLColorHex)
});

class EnvironmentForm extends Component {
	preSubmit = (values) => {
		delete values.set_as_current;
		return [ values, true ];
	};
	render () {
		const { onSubmit, transformInputs, submitMsg } = this.props;

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
							value: `${capitalized}_env`,
							icon: getColoredIcons('Settings', color)
						};
					})
				},
				defaultValue: 'Red_env'
			},
			{ name: 'animation', type: 'checkbox', defaultValue: true },
			{ name: 'sound', type: 'checkbox', defaultValue: true },
			{ name: 'hovertips', type: 'checkbox', defaultValue: true },
			{
				type: 'group',
				name: 'environment',
				extra: { treeView: true },
				children: [
					{ name: 'favourite', type: 'checkbox', defaultValue: false },
					{ name: 'public', type: 'checkbox', defaultValue: true },
					{ name: 'set_as_current', type: 'checkbox', defaultValue: true }
				]
			},
			{ name: 'reset_on_success', type: 'checkbox', defaultValue: true },
			{ name: 'reset_on_error', type: 'checkbox', defaultValue: false },
			createEnvGroups('explore_page'),
			createEnvGroups('self_page'),
			createEnvGroups('watchlist_page'),
			createEnvGroups('play_page'),
			{
				name: 'default_create_landing',
				type: 'select',
				extra: {
					selectItems: [ 'quiz', 'question', 'folder', 'environment' ].map((land) => {
						return {
							text: land.charAt(0).toUpperCase() + land.substr(1)
						};
					})
				},
				defaultValue: 'Quiz'
			},
			{
				type: 'group',
				name: 'questioninfo',
				extra: { treeView: true, coalesce: true },
				children: [
					{
						name: 'default_type',
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
						name: 'default_difficulty',
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
						name: 'default_timing',
						type: 'number',
						inputProps: {
							min: 15,
							max: 120,
							step: 5
						},
						defaultValue: 30
					},
					{
						name: 'default_weight',
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
				name: 'color_group',
				type: 'group',
				extra: { treeView: true },
				children: [
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
						defaultValue: 'Dark'
					},
					{
						name: 'default_tag_color',
						defaultValue: '#000'
					},
					{
						name: 'primary_color',
						defaultValue: '#3f51b5'
					},
					{
						name: 'secondary_color',
						defaultValue: '#f50057'
					}
				]
			},
			{
				type: 'group',
				name: 'keybindings',
				extra: { treeView: true, coalesce: true, groupType: 'text', helperText: 'Provide Custom keybindings' },
				children: [
					{
						name: 'MOVE_UP',
						type: 'text',
						defaultValue: 'up'
					},
					{
						name: 'MOVE_DOWN',
						type: 'text',
						defaultValue: 'down'
					},
					{
						name: 'CHECK',
						type: 'text',
						defaultValue: 's'
					},
					...Array(5).fill(0).map((_, i) => ({
						name: `LOCAL_ACTION_${i + 1}`,
						type: 'text',
						defaultValue: `${i + 1}`
					})),
					...Array(5).fill(0).map((_, i) => ({
						name: `GLOBAL_ACTION_${i + 1}`,
						type: 'text',
						defaultValue: `shift+${i + 1}`
					}))
				]
			},
			{
				type: 'group',
				name: 'notification_groups',
				extra: { treeView: true },
				children: [
					{
						name: 'notification_timing',
						type: 'number',
						inputProps: {
							min: 1000,
							max: 5000,
							step: 250
						},
						defaultValue: 2500
					},
					{
						name: 'max_notifications',
						type: 'number',
						inputProps: {
							min: 3,
							max: 10,
							step: 1
						},
						defaultValue: 5
					}
				]
			},
			{
				name: 'display_font',
				defaultValue: 'Quantico'
			}
		];
		if (transformInputs) defaultInputs = transformInputs(defaultInputs);

		return (
			<div className="create_env create_form">
				<InputForm
					submitMsg={submitMsg}
					inputs={defaultInputs}
					validationSchema={validationSchema}
					onSubmit={onSubmit.bind(null, [ 'environment', this.preSubmit ])}
				/>
			</div>
		);
	}
}

export default EnvironmentForm;
