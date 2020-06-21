import React, { Component, Fragment } from 'react';
import { Route, withRouter } from 'react-router-dom';
import Composer from 'react-composer';
import { flatten } from 'lodash';

import DataFetcher from '../../components/DataFetcher/DataFetcher';
import Explorer from '../../components/Explorer/Explorer';
import CustomList from '../../components/List/CustomList';
import IdList from '../../components/List/IdList';
import PlayStats from './PlayStats';
import PlaySettings from './PlaySettings';
import TabSwitcher from '../../components/Tab/TabSwitcher';
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
					({ results, render }) => (
						<TabSwitcher
							comp="play"
							type={'Quiz'}
							runAfterSwitch={(type) => {
								results[0].refetchData(type, {});
							}}
							children={render}
						/>
					),
					<IdList />,
					({ results, render }) => {
						const quizzes =
							results[1].type === 'Quiz'
								? results[0].data
								: flatten(results[0].data.map((folder) => folder.quizzes || []));
						return <PlaySettings selectedQuizIds={results[2].ids} quizzes={quizzes} children={render} />;
					}
				]}
			>
				{([ DataFetcher, TabSwitcher, IdList, PlaySettings ]) => {
					const { CustomTabs, type } = TabSwitcher;
					const { data: quizzes, totalCount, refetchData } = DataFetcher;
					this.refetchData = refetchData;
					const { ids, addToList, removeFromList } = IdList;
					const { formData, PlaySettingsForm, selectedQuizzes, filteredQuizzes } = PlaySettings;
					return (
						<Fragment>
							{history.location.pathname === '/play' ? (
								<div className="play pages">
									{CustomTabs}
									<Explorer
										page={'Play'}
										data={quizzes.map((item) => ({
											...item,
											added: ids.includes(item._id)
										}))}
										totalCount={totalCount}
										type={type}
										refetchData={refetchData.bind(null, type)}
										hideDetailer
										customHandlers={{
											add: addToList
										}}
									/>
									<CustomList
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
									{PlaySettingsForm}
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
