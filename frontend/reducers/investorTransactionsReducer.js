import { FETCH_INVESTOR_TRANSACTIOS, INITIAL_STATE } from '../actions/types';

export default function (state = [], action) {
	switch (action.type) {
		case FETCH_INVESTOR_TRANSACTIOS:
			return action.payload;

		case INITIAL_STATE:
			return state;
			
		default:
			return state;
	}
}
