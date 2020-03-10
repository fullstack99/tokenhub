import {
	FETCH_DISTRIBUTION_TRANSACTIONS,
	INITIAL_STATE
} from '../actions/types';

const initialState = {
	isFetching: true,
	isFetched: false,
	data: []
};

export default function(state = initialState, action) {
	switch (action.type) {
		case FETCH_DISTRIBUTION_TRANSACTIONS:
			return Object.assign({}, state, {
				isFetching: false,
				isFetched: true,
				data: action.payload
			});

		case INITIAL_STATE:
			return state;
		default:
			return state;
	}
}
