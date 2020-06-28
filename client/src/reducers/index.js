import { combineReducers } from 'redux';

import authedUser from './authedUser';
import pageQueries from './pageQueries';

export default combineReducers({
	authedUser,
	pageQueries
});
