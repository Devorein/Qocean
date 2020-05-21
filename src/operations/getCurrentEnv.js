import axios from 'axios';

export default () => {
	return axios.get('http://localhost:5001/api/v1/environments/me', {
		headers: {
			Authorization: `Bearer ${localStorage.getItem('token')}`
		}
	});
};
