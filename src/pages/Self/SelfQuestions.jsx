import React, { Component } from 'react';
import DataTable from '../../components/DataTable/DataTable';
import moment from 'moment';

class SelfQuestions extends Component {
	decideLabel = (name) => {
		return name.split('_').map((value) => value.charAt(0).toUpperCase() + value.substr(1)).join(' ');
	};

	decideColums = () => {
		return this.props.cols
			.concat([
				{ name: 'name' },
				{ name: 'difficulty' },
				{ name: 'type' },
				{ name: 'time_allocated' },
				{ name: 'quiz' },
				{ name: 'public' },
				{ name: 'favourite' },
				{ name: 'created_at' },
				{ name: 'updated_at' }
			])
			.map(({ name }) => {
				return {
					name,
					label: this.decideLabel(name)
				};
			});
	};

	transformOption = (option) => {
		return option;
	};

	filterData = (item) => {
		const exclude = [ '__v', 'user', '_id' ];
		const primary = [ 'question', 'public', 'favourite' ];

		return {
			exclude,
			primary
		};
	};

	transformData = (data) => {
		return data.map((item, index) => {
			return {
				...item,
				quiz: item.quiz.name,
				created_at: moment(item.created_at).fromNow(),
				updated_at: moment(item.updated_at).fromNow()
			};
		});
	};

	render() {
		const { decideColums, transformData, transformOption, filterData } = this;
		const { options, data, genericTransformData } = this.props;
		return (
			<DataTable
				title={`Question List`}
				data={transformData(genericTransformData(data, filterData))}
				columns={decideColums()}
				options={transformOption(options)}
			/>
		);
	}
}

export default SelfQuestions;
