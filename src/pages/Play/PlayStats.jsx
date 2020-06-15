import React, { Component } from 'react';
import BasicTable from '../../components/DataTable/BasicTable';
import quizStats from '../../Utils/quizStats';
import CheckboxInput from '../../components/Input/Checkbox/CheckboxInput';

class PlayStats extends Component {
	state = {
		showQuizzes: true
	};
	render() {
		const { quizzes, selectedQuizzes } = this.props;
		const { showQuizzes } = this.state;
		return (
			<div className="play_stats">
				<CheckboxInput
					className="PlayStats_toggletarget"
					checked={this.state.showQuizzes}
					label={'All Quizzes'}
					onChange={(e) => {
						this.setState({ showQuizzes: !this.state.showQuizzes });
					}}
				/>
				<BasicTable
					title={'Question Time'}
					contents={quizStats(showQuizzes ? quizzes : selectedQuizzes, 'time_allocated')}
				/>
				<BasicTable
					title={'Question Difficulty'}
					contents={quizStats(showQuizzes ? quizzes : selectedQuizzes, 'difficulty')}
				/>
				<BasicTable title={'Question Types'} contents={quizStats(showQuizzes ? quizzes : selectedQuizzes, 'type')} />
			</div>
		);
	}
}

export default PlayStats;
