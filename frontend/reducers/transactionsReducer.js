import {
	FETCH_TRANSACTIONS_SUCCESS,
	FETCH_TRANSACTIONS_FAIL,
	FETCH_WITHDRAWAL_REFUND_TRANSACTIONS_SUCCESS,
	FETCH_WITHDRAWAL_REFUND_TRANSACTIONS_FAIL,
	FETCH_TRANSACTIONS_REQUEST,
	FETCH_UPDATED_TRANSACTION_SUCCESS,
	FETCH_UPDATED_TRANSACTION_FAIL,
	FETCH_UPDATED_TRANSACTION,
	INITIAL_STATE,
	UPLOAD_TRANSACTIONS_SUCCESS,
	UPLOAD_TRANSACTIONS_FAILD
} from '../actions/types';

const initialState = {
	isFetching: true,
	isFetched: false,
	data: [],
	refundedTransaction: {},
	error: [],
	refundedFlag: "",
	updatedFlag: "",
	uploadFlag: "",
	uploadedTrasctions: []
};

export default function (state = initialState, action) {
	switch (action.type) {
		case FETCH_TRANSACTIONS_SUCCESS:
			return Object.assign({}, state, {
				isFetching: false,
				isFetched: true,
				data: action.payload
			});

		case FETCH_TRANSACTIONS_SUCCESS:
			return Object.assign({}, state, {
				isFetching: false,
				isFetched: true,
				data: [],
				error: action.error
			});

		case FETCH_WITHDRAWAL_REFUND_TRANSACTIONS_SUCCESS:
			return Object.assign({}, state, {
				isFetching: false,
				isFetched: true,
				refundedTransaction: action.payload,
				refundedFlag: true
			});

		case FETCH_WITHDRAWAL_REFUND_TRANSACTIONS_FAIL:
			return Object.assign({}, state, {
				isFetching: false,
				isFetched: true,
				refundedFlag: false
			});

		case FETCH_TRANSACTIONS_REQUEST:
			return Object.assign({}, state, {
				refundedFlag: "",
				updatedFlag: "",
				uploadFlag: ""
			});

		case FETCH_UPDATED_TRANSACTION_SUCCESS:
			return Object.assign({}, state, {
				updatedFlag: true
			});

		case FETCH_UPDATED_TRANSACTION_FAIL:
			return Object.assign({}, state, {
				updatedFlag: false
			});

		case FETCH_UPDATED_TRANSACTION:
			return Object.assign({}, state, {
				updatedFlag: action.payload.success
			});
		case UPLOAD_TRANSACTIONS_SUCCESS:
			return Object.assign({}, state, {
				uploadFlag: true,
				uploadedTrasctions: action.payload
			});
		case UPLOAD_TRANSACTIONS_FAILD:
			return Object.assign({}, state, {
				uploadFlag: false,
				uploadedTrasctions: action.payload
			});
		case INITIAL_STATE:
			return state;
		default:
			return state;
	}
}
