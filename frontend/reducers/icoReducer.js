import { FETCH_SELECTED_ICO, INITIAL_STATE } from '../actions/types';

export default function (state = [], action) {
	switch (action.type) {
		case FETCH_SELECTED_ICO:
			return action.payload;

		case INITIAL_STATE:
			return state;

		default:
			return state;
	}
}
