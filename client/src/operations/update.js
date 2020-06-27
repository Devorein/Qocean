import axios from 'axios';
import pluralize from 'pluralize';

export default (type, values) => {
	return axios.put(
		`http://localhost:5001/api/v1/${pluralize(type)}`,
		{
			...values
		},
		{
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		}
	);
};
