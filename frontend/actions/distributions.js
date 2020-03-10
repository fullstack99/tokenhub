import axios from 'axios';

import {
	FETCH_DISTRIBUTION_TRANSACTIONS,
	FETCH_UPDATED_TRANSACTION_SUCCESS,
	FETCH_UPDATED_TRANSACTION_FAIL,
	FETCH_TRANSACTIONS_REQUEST
} from './types';

export const getDistributionTransactions = () => async dispatch => {
	const res = await axios.get('/api/distributions');
	dispatch({ type: FETCH_DISTRIBUTION_TRANSACTIONS, payload: res.data });
};

export const transactionRequest = () => async dispatch => {
	dispatch({ type: FETCH_TRANSACTIONS_REQUEST, payload: {} });
};
