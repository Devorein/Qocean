import React, { Component, Fragment } from 'react';
import { Route, withRouter } from 'react-router-dom';
import DeleteIcon from '@material-ui/icons/Delete';

import DataFetcher from '../../components/DataFetcher/DataFetcher';
import Explorer from '../../components/Explorer/Explorer';
import CustomList from '../../components/List/List';
import IdList from '../../components/List/IdList';
import PlayStats from './PlayStats';
import PlaySettings from './PlaySettings';
import Quiz from '../Start/Quiz';

import './Play.scss';

class Play extends Component {
	transformList = (quizzes, selectedQuizIds) => {
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

	render() {
		const { history, match } = this.props;
		return (
			<DataFetcher page="Play">
				{({ data: quizzes, totalCount, refetchData }) => {
					return (
						<IdList>
							{({ ids, addToList, removeFromList }) => {
								return (
									<PlaySettings selectedQuizIds={ids} quizzes={quizzes}>
										{({ formData, inputs, selectedQuizzes, filteredQuizzes }) => {
											return (
												<Fragment>
													{history.location.pathname === '/play' ? (
														<CustomList
															className="play_list"
															listItems={this.transformList(quizzes, ids)}
															icons={[
																{
																	icon: DeleteIcon,
																	onClick: removeFromList
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
																				added: ids.includes(item._id)
																			}))}
																			totalCount={totalCount}
																			type={'Quiz'}
																			refetchData={refetchData.bind(null, 'Quiz')}
																			hideDetailer
																			customHandlers={{
																				add: addToList
																			}}
																		/>
																		{list}
																		<PlayStats quizzes={quizzes} selectedQuizzes={selectedQuizzes} />
																		{inputs}
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
						</IdList>
					);
				}}
			</DataFetcher>
		);
	}
}

export default withRouter(Play);
