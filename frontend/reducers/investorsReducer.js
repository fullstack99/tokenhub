import { FETCH_INVESTORS, INITIAL_STATE } from '../actions/types';

export default function (state = [], action) {
	switch (action.type) {
		case FETCH_INVESTORS:
			return action.payload;

		case INITIAL_STATE:
			return state;
		default:
			return state;
	}
}
