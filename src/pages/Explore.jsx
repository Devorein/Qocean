import React, { Component } from 'react';
import QuizList from '../components/List/QuizList';
import FolderList from '../components/List/FolderList';
import QuestionList from '../components/List/QuestionList';
import EnvironmentList from '../components/List/EnvironmentList';

class Explore extends Component {
	state = {
		currentType: 'quizes'
	};
	changeCurrentType = (type) => {
		this.setState({
			currentType: type
		});
	};
	decideExploreResult = () => {
		const { currentType } = this.state;
		if (currentType === 'quizes') return <QuizList />;
		else if (currentType === 'questions') return <QuestionList />;
		else if (currentType === 'folders') return <FolderList />;
		else if (currentType === 'environments') return <EnvironmentList />;
		return <QuizList />;
	};
	render() {
		return (
			<div className="Explore page">
				<div className="explore-types">
					{[ 'Quizes', 'Questions', 'Folders', 'Environments' ].map((type) => {
						return (
							<div
								key={type}
								className={`explore-type explore-type-${type.toLowerCase()}`}
								onClick={(e) => {
									this.changeCurrentType(type.toLowerCase());
								}}
							>
								{type}
							</div>
						);
					})}
				</div>
				<div className="explore-results">{this.decideExploreResult()}</div>
			</div>
		);
	}
}

export default Explore;
