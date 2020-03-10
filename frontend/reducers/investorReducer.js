import { 
	FETCH_INVESTOR,
	INITIAL_STATE } from '../actions/types';

export default function(state = {}, action) {
	switch (action.type) {
		case FETCH_INVESTOR:
			return action.payload;

		case INITIAL_STATE:
			return state;

		default:
			return state;
	}
}
