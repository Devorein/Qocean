import React, { Component } from 'react';
import axios from 'axios';
import download from '../../Utils/download';
import GenericButton from '../../components/Buttons/GenericButton';
import { withSnackbar } from 'notistack';

class ExportAll extends Component {
	getData = (type) => {
		return axios.get(`http://localhost:5001/api/v1/${type}/me`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		});
	};

	transformData = (data, type) => {
		return data.map((data) => {
			const negate = [ 'user', '_id', '__v', 'id' ];
			const temp = {};
			if (type === 'Quiz')
				negate.push(
					'average_quiz_time',
					'average_difficulty',
					'total_questions',
					'total_folders',
					'folders',
					'rating',
					'questions'
				);
			else if (type === 'Question') negate.push('quiz');
			else if (type === 'Folder') negate.push('quizzes', 'total_questions', 'total_quizzes');

			const fields = Object.keys(data).filter((key) => negate.indexOf(key) === -1);
			fields.forEach((field) => (temp[field] = data[field]));
			return temp;
		});
	};

	downloadAll = () => {
		const { enqueueSnackbar } = this.props;
		const reductiveDownloadChain = (items) => {
			return items.reduce((chain, type) => {
				return chain.then((_) => {
					this.getData(type).then(({ data: { data } }) => {
						const json = JSON.stringify(this.transformData(data, type));
						download(`${type}_${Date.now()}`, json);
						enqueueSnackbar(`${type} has been exported`, {
							variant: 'success'
						});
					});
				});
			}, Promise.resolve());
		};

		reductiveDownloadChain([ 'folders', 'questions', 'quizzes', 'environments' ]);
	};

	render() {
		return <GenericButton text="Export all" onClick={this.downloadAll} />;
	}
}

export default withSnackbar(ExportAll);
