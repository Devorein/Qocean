import axios from 'axios';
import pluralize from 'pluralize';

export default (type, id) => {
	console.log(type);
	return axios.delete(`http://localhost:5001/api/v1/${pluralize(type, 2)}/${id}`, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem('token')}`
		}
	});
};
