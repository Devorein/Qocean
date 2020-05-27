import axios from 'axios';

export default (env) => {
	return axios.post(
		`http://localhost:5001/api/v1/environments/setcurrent`,
		{
			env
		},
		{
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		}
	);
};
