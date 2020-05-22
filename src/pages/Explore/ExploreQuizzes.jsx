import React, { Component } from 'react';
import DataTable from '../../components/DataTable/DataTable';
import moment from 'moment';

class ExploreQuizzes extends Component {
	decideLabel = (name) => {
		return name.split('_').map((value) => value.charAt(0).toUpperCase() + value.substr(1)).join(' ');
	};

	decideColums = () => {
		return [ 'icon', 'created_at', 'name', 'total_quizzes', 'total_questions', 'username' ].map((name) => {
			return {
				name,
				label: this.decideLabel(name),
				filter: true,
				sort: true
			};
		});
	};

	transformOption = (option) => {
		return option;
	};

	transformData = (data) => {
		return data.map((item, index) => {
			return {
				...item,
				username: item.user.username,
				created_at: moment(item.created_at).fromNow()
			};
		});
	};

	render() {
		const { decideColums, transformData, transformOption } = this;
		const { options, data } = this.props;
		return (
			<div>
				<DataTable
					title={`Quiz List`}
					data={transformData(data)}
					columns={decideColums()}
					options={transformOption(options)}
				/>
			</div>
		);
	}
}

export default ExploreQuizzes;
