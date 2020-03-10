import { FETCH_USER, INITIAL_STATE } from '../actions/types';

export default function (state = {}, action) {
	switch (action.type) {
		case FETCH_USER:
			return action.payload || false;

		case INITIAL_STATE:
			return false;

		default:
			return state;
	}
}
