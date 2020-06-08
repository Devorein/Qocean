import axios from 'axios';
import download from './download';
import shortid from 'shortid';
import shaveData from './shaveData';

export default function(type, data) {
	type = type.toLowerCase();

	if (type === 'question') {
		return axios
			.put(
				'http://localhost:5001/api/v1/questions/_/answers',
				{
					questions: data.map(({ _id }) => _id)
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`
					}
				}
			)
			.then(({ data: { data: answers } }) => {
				const dataWithAnswers = data.map((data, index) => ({ ...data, answers: answers[index].answers }));
				return shaveData(dataWithAnswers, type, { purpose: 'download' });
			})
			.then((data) => {
				download(`${Date.now()}_${shortid.generate()}.json`, JSON.stringify(data));
			});
	} else
		download(
			`${Date.now()}_${shortid.generate()}.json`,
			JSON.stringify(shaveData(data, type, { purpose: 'download' }))
		);
}
