import { FETCH_ALL_ADMIN_LOGS, FETCH_ADMIN_LOGS_REQUEST, INITIAL_STATE } from '../actions/types';

const initialState = {
	isFetching: true,
	isFetched: false,
	data: [],
	length: 0
};

export default function (state = initialState, action) {
	switch (action.type) {
		case FETCH_ALL_ADMIN_LOGS:
			return Object.assign({}, state, {
				isFetching: false,
				isFetched: true,
				data: action.payload,
				length: action.length
			});

		case FETCH_ADMIN_LOGS_REQUEST:
			return Object.assign({}, state, {
				isFetching: false,
				isFetched: true,
				data: action.payload
			});

		case INITIAL_STATE: {
			return state;
		}

		default:
			return state;
	}
}
