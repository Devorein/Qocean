import React, { Component } from 'react';
import quizStats from '../../Utils/quizStats';
import CheckboxInput from '../../components/Input/Checkbox/CheckboxInput';
import Visualizer from '../../components/Visualizations/Visualizer';

class PlayStats extends Component {
	state = {
		showQuizzes: true
	};
	render() {
		const { quizzes, selectedQuizzes } = this.props;
		const { showQuizzes } = this.state;
		return (
			<div className="PlayStats">
				<CheckboxInput
					className="PlayStats_toggletarget"
					checked={this.state.showQuizzes}
					label={'All Quizzes'}
					onChange={(e) => {
						this.setState({ showQuizzes: !this.state.showQuizzes });
					}}
				/>
				<div className="PlayStats_Visualizers">
					<Visualizer
						title={'Question Time'}
						contents={quizStats(showQuizzes ? quizzes : selectedQuizzes, 'time_allocated')}
					/>
					<Visualizer
						title={'Question Difficulty'}
						contents={quizStats(showQuizzes ? quizzes : selectedQuizzes, 'difficulty')}
					/>
					<Visualizer title={'Question Types'} contents={quizStats(showQuizzes ? quizzes : selectedQuizzes, 'type')} />
				</div>
			</div>
		);
	}
}

export default PlayStats;
