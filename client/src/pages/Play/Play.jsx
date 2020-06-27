import React, { Component, Fragment } from 'react';
import { Route, withRouter } from 'react-router-dom';
import Composer from 'react-composer';
import axios from 'axios';

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
	state = {
		quizzes: []
	};

	componentDidMount() {
		axios
			.get(`http://localhost:5001/api/v1/quizzes/playPageQuiz`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
			})
			.then(({ data: { data: quizzes } }) => {
				this.setState({
					quizzes
				});
			});
	}

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
		const { quizzes } = this.state;
		return (
			<Composer
				components={[
					<DataFetcher page="Play" type={'Quiz'} />,
					({ results, render }) => (
						<TabSwitcher
							comp="play"
							type={'Quiz'}
							runAfterSwitch={(type, cb) => {
								results[0].refetchData(type, {}, cb);
							}}
							children={render}
						/>
					),
					<IdList />,
					({ results, render }) => {
						return <PlaySettings selectedQuizIds={results[2].ids} quizzes={quizzes} children={render} />;
					}
				]}
			>
				{([ DataFetcher, TabSwitcher, IdList, PlaySettings ]) => {
					const { CustomTabs } = TabSwitcher;
					const { data, totalCount, refetchData, updateDataLocally, type } = DataFetcher;
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
										data={data.map((item) => ({
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
										updateDataLocally={updateDataLocally}
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
