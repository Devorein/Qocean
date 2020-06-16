import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { withStyles } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';

import RadioInput from '../../components/Input/RadioInput';
import GenericButton from '../../components/Buttons/GenericButton';
import './Question.scss';

class Question extends Component {
	state = {
		user_answers: [],
		show_answer: false
	};

	componentWillUnmount = () => {
		this._ismounted = false;
	};

	componentDidMount() {
		this._ismounted = true;
	}

	getFlashCardAnswer = () => {
		axios
			.get(`http://localhost:5001/api/v1/questions/answers/${this.props.question._id}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
			})
			.then(({ data: { data: [ answers ] } }) => {
				if (this._ismounted)
					this.setState({
						show_answer: true,
						answers
					});
			});
	};

	renderQuestionBody = () => {
		const { question: { type, options, name, shuffled } } = this.props;
		if (type === 'MS')
			return options.map((option, index) => {
				index = shuffled ? option.index : index;
				return (
					<Fragment key={shuffled ? option.option : `${option}${index}`}>
						<div
							className="Question_Options_Item"
							onClick={(e) => {
								let { user_answers } = this.state;
								if (!user_answers.includes(index)) user_answers.push(index);
								else user_answers = user_answers.filter((answer) => answer !== index);
								if (this._ismounted) this.setState({ user_answers });
							}}
						>
							<Checkbox checked={this.state.user_answers.includes(index)} color="primary" />
							{shuffled ? option.option : option}
						</div>
					</Fragment>
				);
			});
		else if (type === 'FIB') {
			return name.split(/\$\{_\}/g).map((match, index) => {
				return (
					<div className="Question_Options_Item" key={`FIB_option_${index}`}>
						<div className="Question_Options_Item_name">{match.trim()}</div>
						<TextField
							className="Question_Options_Item_answer"
							value={this.state.user_answers[index] ? this.state.user_answers[index] : ''}
							onChange={(e) => {
								const { user_answers } = this.state;
								user_answers[index] = e.target.value;
								if (this._ismounted)
									this.setState({
										user_answers
									});
							}}
						/>
					</div>
				);
			});
		} else if (type === 'TF' || type === 'MCQ') {
			let radioItems = null;
			if (type === 'TF')
				radioItems = [ 'False', 'True' ].map((option, index) => ({ label: option, value: index.toString() }));
			else if (type === 'MCQ') {
				if (shuffled)
					radioItems = options.map(({ option, index }) => ({
						label: option,
						value: index.toString()
					}));
				else
					radioItems = options.map((option, index) => ({
						label: option,
						value: index.toString()
					}));
			}
			return (
				<RadioInput
					radioItemsClass="Question_Options_Item"
					radioItems={radioItems}
					value={this.state.user_answers[0] ? this.state.user_answers[0] : ''}
					onChange={(e) => {
						if (this._ismounted)
							this.setState({
								user_answers: [ e.target.value ]
							});
					}}
				/>
			);
		} else if (type === 'Snippet')
			return (
				<div className="Question_Options_Item">
					<TextField
						value={this.state.user_answers[0] ? this.state.user_answers[0] : ''}
						onChange={(e) => {
							if (this._ismounted)
								this.setState({
									user_answers: [ e.target.value ]
								});
						}}
					/>
				</div>
			);
		else if (type === 'FC')
			return (
				<Fragment>
					{!this.state.show_answer ? (
						<div className="Question_Options_Item">
							<GenericButton
								text={'show'}
								onClick={(e) => {
									this.getFlashCardAnswer();
								}}
							/>
						</div>
					) : (
						this.state.answers.map((answer, index) => (
							<div className="Question_Options_Item" key={answer}>
								<Checkbox
									checked={this.state.user_answers.includes(index)}
									onChange={(e) => {
										let { user_answers } = this.state;
										if (e.target.checked) user_answers.push(index);
										else user_answers = user_answers.filter((answer) => answer !== index);
										if (this._ismounted) this.setState({ user_answers });
									}}
									color="primary"
								/>
								{answer}
							</div>
						))
					)}
				</Fragment>
			);
	};

	renderQuestionStat = () => {
		const { decideLabel } = this;
		const { question } = this.props;

		const stats = [ 'difficulty', 'add_to_score', 'type', 'weight' ];
		return stats.map((stat) => (
			<div className="Question_Stats_Item" key={stat}>
				<span className="Question_Stats_Item_key">{decideLabel(stat)}</span> :
				<span className="Question_Stats_Item_value">{question[stat].toString()}</span>
			</div>
		));
	};

	resetAnswers = () => {
		if (this._ismounted)
			this.setState({
				user_answers: [],
				show_answer: false
			});
	};

	decideLabel = (label) => {
		return label.split('_').map((chunk) => chunk.charAt(0).toUpperCase() + chunk.substr(1)).join(' ');
	};

	render() {
		let { question } = this.props;
		return this.props.children({
			question: question ? (
				<div className={`Question ${this.props.classes.root}`}>
					<div className="Question_Stats">{this.renderQuestionStat()}</div>
					{question.image ? (
						<div className="Question_Image">
							<img src={question.image} alt="question" />
						</div>
					) : null}
					{question.type !== 'FIB' ? <div className="Question_name">{question.name}</div> : null}
					<div className={`Question_Options Question_Options--${question.type}`}>{this.renderQuestionBody()}</div>
				</div>
			) : (
				<div>Loading question</div>
			),
			questionManip: {
				user_answers: this.state.user_answers,
				reset_answers: this.resetAnswers
			}
		});
	}
}

export default withStyles((theme) => ({
	root: {
		'& .Question_Stats': {
			backgroundColor: theme.palette.background.dark
		},
		'& .Question_Stats_Item': {
			backgroundColor: theme.palette.background.main
		},
		'& .Question_name': {
			backgroundColor: theme.palette.background.dark
		},
		'& .Question_Options_Item': {
			backgroundColor: theme.palette.background.main
		}
	}
}))(Question);
