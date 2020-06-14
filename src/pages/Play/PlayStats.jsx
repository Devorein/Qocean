import React, { Component } from 'react';
import BasicTable from '../../components/DataTable/BasicTable';
import quizStats from '../../Utils/quizStats';

class PlayStats extends Component {
	render() {
		const { quizzes } = this.props;
		return (
			<div className="play_stats">
				<BasicTable title={'Question Time'} contents={quizStats(quizzes, 'time_allocated')} />
				<BasicTable title={'Question Difficulty'} contents={quizStats(quizzes, 'difficulty')} />
				<BasicTable title={'Question Types'} contents={quizStats(quizzes, 'type')} />
			</div>
		);
	}
}

export default PlayStats;
