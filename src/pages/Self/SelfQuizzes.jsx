import React, { Component } from 'react';
import DataTable from '../../components/DataTable/DataTable';
import moment from 'moment';
import ChipContainer from '../../components/Chip/ChipContainer';
class SelfQuizzes extends Component {
	decideLabel = (name) => {
		return name.split('_').map((value) => value.charAt(0).toUpperCase() + value.substr(1)).join(' ');
	};

	decideColums = () => {
		return this.props.cols
			.concat([
				{ name: 'ratings' },
				{ name: 'name' },
				{ name: 'subject' },
				{ name: 'average_quiz_time' },
				{ name: 'average_difficulty' },
				{ name: 'tags' },
				{ name: 'source' },
				{ name: 'watchers' },
				{ name: 'total_questions' },
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
		const primary = [ 'name', 'public', 'favourite', 'total_questions', 'subject', 'tags' ];

		return {
			exclude,
			primary
		};
	};

	transformData = (data) => {
		return data.map((item, index) => {
			return {
				...item,
				name: <div style={{ maxHeight: 100, overflowY: 'auto' }}>{item.name}</div>,
				watchers: item.watchers.length,
				tags: <ChipContainer chips={item.tags} type={'regular'} height={100} />,
				creator: item.user.username,
				created_at: moment(item.created_at).fromNow(),
				updated_at: moment(item.updated_at).fromNow()
			};
		});
	};

	render() {
		const { decideColums, transformData, transformOption, filterData } = this;
		let { options, data, genericTransformData } = this.props;
		return (
			<DataTable
				title={`Quiz List`}
				data={transformData(genericTransformData(data, filterData))}
				columns={decideColums()}
				options={transformOption(options)}
			/>
		);
	}
}

export default SelfQuizzes;
