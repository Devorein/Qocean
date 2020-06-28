import { SET_PAGE_QUERIES } from '../actions/queries';

export default function pageQueries(state = {}, action) {
	switch (action.type) {
		case SET_PAGE_QUERIES:
			return action.pageQueries;
		default:
			return state;
	}
}
