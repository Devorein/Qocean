import React, { Component, Fragment } from 'react';
import { Route, withRouter } from 'react-router-dom';
import Composer from 'react-composer';

import DataFetcher from '../../components/DataFetcher/DataFetcher';
import Explorer from '../../components/Explorer/Explorer';
import CustomList from '../../components/List/CustomList';
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
			<Composer
				components={[
					<DataFetcher page="Play" />,
					<IdList />,
					({ results, render }) => (
						<PlaySettings selectedQuizIds={results[1].ids} quizzes={results[0].data} children={render} />
					)
				]}
			>
				{([ DataFetcher, IdList, PlaySettings ]) => {
					const { data: quizzes, totalCount, refetchData } = DataFetcher;
					const { ids, addToList, removeFromList } = IdList;
					const { formData, inputs, selectedQuizzes, filteredQuizzes } = PlaySettings;
					return (
						<Fragment>
							{history.location.pathname === '/play' ? (
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
									<CustomList
										className="play_list"
										listItems={this.transformList(quizzes, ids)}
										icons={[
											{
												icon: 'delete',
												onClick: removeFromList,
												popoverText: 'Delete from list'
											}
										]}
									/>
									<PlayStats quizzes={quizzes} selectedQuizzes={selectedQuizzes} />
									{inputs}
								</div>
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
			</Composer>
		);
	}
}

export default withRouter(Play);
