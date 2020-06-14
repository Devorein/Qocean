import React, { Component } from 'react';
import BasicTable from '../../components/DataTable/BasicTable';
import quizStats from '../../Utils/quizStats';

class PlayStats extends Component {
	render() {
		const { quizzes } = this.props;
		const [ timeHeaders, timeRows ] = quizStats(quizzes, 'time_allocated');
		const [ difficultyHeaders, difficultyRows ] = quizStats(quizzes, 'difficulty');
		const [ typeHeaders, typeRows ] = quizStats(quizzes, 'type');
		return (
			<div className="play_stats">
				<BasicTable title={'Question Difficulty'} headers={difficultyHeaders} rows={difficultyRows} />
				<BasicTable title={'Question Types'} headers={typeHeaders} rows={typeRows} />
				<BasicTable title={'Question Time'} headers={timeHeaders} rows={timeRows} />
			</div>
		);
	}
}

export default PlayStats;
