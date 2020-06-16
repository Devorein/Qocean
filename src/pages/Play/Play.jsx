import React, { Component, Fragment } from 'react';
import { Route, withRouter } from 'react-router-dom';
import DeleteIcon from '@material-ui/icons/Delete';

import DataFetcher from '../../components/DataFetcher/DataFetcher';
import Explorer from '../../components/Explorer/Explorer';
import CustomList from '../../components/List/List';
import PlayStats from './PlayStats';
import PlaySettings from './PlaySettings';
import Quiz from '../Start/Quiz';

import './Play.scss';

class Play extends Component {
	state = {
		selectedQuizIds: []
	};

	transformList = (quizzes) => {
		const { selectedQuizIds } = this.state;

		return selectedQuizIds.map((id) => {
			const quiz = quizzes.find((quiz) => quiz._id === id);
			return {
				_id: quiz._id,
				primary: quiz.name,
				primaryIcon: 'Quiz',
				secondary: `${quiz.questions.length} Questions`
			};
		});
	};

	onDelete = (_ids) => {
		const { selectedQuizIds } = this.state;
		_ids.forEach((_id) => {
			selectedQuizIds.splice(selectedQuizIds.indexOf(_id), 1);
		});
		this.setState({
			selectedQuizIds
		});
	};

	addToBucketList = (selectedIds) => {
		const { selectedQuizIds } = this.state;
		selectedIds.forEach((selectedId) => {
			const index = selectedQuizIds.indexOf(selectedId);
			if (index === -1) selectedQuizIds.push(selectedId);
			else selectedQuizIds.splice(index, 1);
		});
		this.setState({
			selectedQuizIds
		});
	};

	render() {
		const { selectedQuizIds } = this.state;
		const { history, match } = this.props;
		return (
			<DataFetcher page="Play">
				{({ data: quizzes, totalCount, refetchData }) => {
					return (
						<PlaySettings selectedQuizIds={selectedQuizIds} quizzes={quizzes}>
							{({ formData, inputs, selectedQuizzes, filteredQuizzes, button }) => {
								return (
									<Fragment>
										{history.location.pathname === '/play' ? (
											<CustomList
												className="play_list"
												listItems={this.transformList(quizzes)}
												icons={[
													{
														icon: DeleteIcon,
														onClick: this.onDelete
													}
												]}
											>
												{({ list }) => {
													return (
														<div className="play pages">
															<Explorer
																page={'Play'}
																data={quizzes.map((item) => ({
																	...item,
																	added: selectedQuizIds.includes(item._id)
																}))}
																totalCount={totalCount}
																type={'Quiz'}
																refetchData={refetchData.bind(null, 'Quiz')}
																hideDetailer
																customHandlers={{
																	add: this.addToBucketList
																}}
															/>
															{list}
															<PlayStats quizzes={quizzes} selectedQuizzes={selectedQuizzes} />
															{inputs}
															<div className="play_button">{button}</div>
														</div>
													);
												}}
											</CustomList>
										) : null}

										<Route path={match.url + '/quiz'} exact>
											<Quiz
												settings={formData.values}
												quizzes={filteredQuizzes.map((filteredQuiz) => ({
													...filteredQuiz,
													questions: filteredQuiz.filteredQuestions
												}))}
											/>
										</Route>
									</Fragment>
								);
							}}
						</PlaySettings>
					);
				}}
			</DataFetcher>
		);
	}
}

export default withRouter(Play);
