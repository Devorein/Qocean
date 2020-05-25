import React, { Component } from 'react';
import InputForm from '../../components/Form/InputForm';

class PlaySettings extends Component {
	render() {
		return (
			<div className="play_settings">
				<InputForm
					formButtons={false}
					inputs={[
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
							}
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
						}
					]}
				/>
			</div>
		);
	}
}

export default PlaySettings;
