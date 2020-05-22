import React, { Component } from 'react';
import InputForm from '../../components/Form/InputForm';
import AddCircleIcon from '@material-ui/icons/AddCircle';

class QuestionForm extends Component {
	state = {
		options: [],
		answers: [],
		showButton: true
	};

	decideInputs = (type) => {
		if (type === 'MCQ') {
			return [ { name: 'option_1' }, { name: 'option_2' }, { name: 'option_3' } ];
		} else if (type === 'MS') {
			return [ { name: 'option_1' }, { name: 'option_2' }, { name: 'option_3' } ];
		} else if (type === 'FC') {
			return [ { name: 'answers', type: 'textarea' } ];
		} else if (type === 'Snippet') {
			return [ { name: 'answers' } ];
		} else if (type === 'FIB') {
			return [];
		} else if (type === 'TF') {
			return [
				{
					name: 'answers',
					type: 'radio',
					radioItems: [ { label: 'True', value: 'true' }, { label: 'False', value: 'false' } ],
					defaultValue: 'true'
				}
			];
		}
		// 	this.setState({
		// 		options: {
		// 			type: 'group',
		// 			name: 'options',
		// 			children: ,
		// 			treeView: true
		// 		},
		// 		answers: {
		// 			name: 'answers',
		// 			type: 'radio',
		// 			radioItems: [
		// 				{ value: 'answer_1', label: 'Answer 1' },
		// 				{ value: 'answer_2', label: 'Answer 2' },
		// 				{ value: 'answer_3', label: 'Answer 3' }
		// 			],
		// 			defaultValue: 'answer_1'
		// 		},
		// 		showButton: true,
		// 		type: value
		// 	});
		// else if (value === 'MS')
		// 	this.setState({
		// 		options: {
		// 			type: 'group',
		// 			name: 'options',
		// 			children: [ { name: 'option_1' }, { name: 'option_2' }, { name: 'option_3' } ],
		// 			treeView: true
		// 		},
		// 		answers: {
		// 			type: 'group',
		// 			name: 'answers',
		// 			treeView: false,
		// 			children: [
		// 				{ name: 'answer_1', type: 'checkbox' },
		// 				{ name: 'answer_2', type: 'checkbox' },
		// 				{ name: 'answer_3', type: 'checkbox' }
		// 			]
		// 		},
		// 		showButton: true,
		// 		type: value
		// 	});
		// else if (value === 'FC') {
		// 	values.answers = '';
		// 	setValues({ ...values });
		// 	this.setState({
		// 		answers: { name: 'answers', type: 'textarea' },
		// 		options: null,
		// 		showButton: false,
		// 		type: value
		// 	});
		// } else if (value === 'TF') {
		// 	Object.entries(values).forEach(([ key, value ]) => {
		// 		if (key.startsWith('option_')) delete values[key];
		// 	});
		// 	values.answers = 'true';
		// 	setValues({ ...values });
		// 	this.setState({
		// 		options: null,
		// 		answers: {
		// 			name: 'answers',
		// 			type: 'radio',
		// 			radioItems: [ { label: 'True', value: 'true' }, { label: 'False', value: 'false' } ],
		// 			defaultValue: 'true'
		// 		},
		// 		showButton: false,
		// 		type: value
		// 	});
		// } else if (value === 'FIB') {
		// 	this.setState({
		// 		options: null,
		// 		answers: {},
		// 		showButton: false,
		// 		type: value
		// 	});
		// } else if (value === 'Snippet') {
		// 	values.answers = '';
		// 	setValues({ ...values });
		// 	this.setState({
		// 		options: null,
		// 		answers: { name: 'answers' },
		// 		showButton: false,
		// 		type: value
		// 	});
		// }
	};

	/* 	addOption = () => {
		let { options, type, answers } = this.state;
		options = [ ...options, { name: `option_${options.length + 1}`, endAdornment: [ 'close', this.removeOption ] } ];

		if (type === 'MCQ') {
			answers = [
				{
					name: 'answers',
					type: 'radio',
					radioItems: [
						...answers[0].radioItems,
						{
							label: `Answer ${answers[0].radioItems.length + 1}`,
							value: `answer_${answers[0].radioItems.length + 1}`
						}
					]
				}
			];
		} else if (type === 'MS') answers = [ ...answers, { name: `answer_${answers.length + 1}`, type: 'checkbox' } ];

		this.setState({
			options,
			answers
		});
	};

	removeOption = (name, e) => {
		let { options, type, answers } = this.state;
		options = options.filter((option) => option.name !== name).map((option, index) => {
			return { ...option, name: `option_${index + 1}` };
		});
		if (type === 'MCQ') {
			answers = [
				{
					name: 'answers',
					type: 'radio',
					radioItems: answers[0].radioItems
						.filter((answer) => answer.value.replace('answer', 'option') !== name)
						.map((answer, index) => {
							return { label: `Answer ${index + 1}`, value: `answer_${index + 1}` };
						})
				}
			];
		} else if (type === 'MS') {
			answers = answers.filter((answer) => answer.name.replace('answer', 'option') !== name).map((answer, index) => {
				return { ...answer, name: `answer_${index + 1}` };
			});
		}

		this.setState({
			options,
			answers
		});
	}; */

	showButton = (type) => {
		if (type === 'MCQ' || type === 'MS') return true;
		else return false;
	};
	render() {
		const { type } = this.props;
		const { options, answers } = this.state;
		const inputs = this.decideInputs(type);
		return (
			<div className="question_form">
				<InputForm inputs={inputs} formButtons={false} />
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					{this.showButton(type) && options.length < 6 ? (
						<AddCircleIcon color={'primary'} onClick={this.addOption} />
					) : null}
				</div>
			</div>
		);
	}
}

// Client side Schema validation
// Alternate
// Form Submission
// Backend question Validation

export default QuestionForm;
