import axios from 'axios';
import pluralize from 'pluralize';

export default (type, id, data) => {
	return axios.put(`http://localhost:5001/api/v1/${pluralize(type, 2)}/${id}`, data, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem('token')}`
		}
	});
};
