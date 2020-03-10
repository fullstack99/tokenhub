import axios from 'axios';

import {
	FETCH_WITHDRAWAL_TRANSACTIONS,
	FETCH_UPDATED_TRANSACTION_SUCCESS,
	FETCH_UPDATED_TRANSACTION_FAIL,
	FETCH_TRANSACTIONS_REQUEST,
	UPLOAD_WITHDRAWALS_SUCCESS,
	UPLOAD_WITHDRAWALS_FAILD,
	FETCH_UPLOAD_REQUEST
} from './types';

export const getWithdrawalTransactions = () => async dispatch => {
	const res = await axios.get('/api/withdrawals');
	dispatch({ type: FETCH_WITHDRAWAL_TRANSACTIONS, payload: res.data });
};

export const updateTransaction = (data) => async dispatch => {
	await axios.put('/api/transaction', data).then(res => {
		dispatch({ type: FETCH_UPDATED_TRANSACTION_SUCCESS, payload: res.data });
	}).catch(error => {
		dispatch({ type: FETCH_UPDATED_TRANSACTION_FAIL, error: error.message });
	})
};

export const transactionRequest = () => async dispatch => {
	dispatch({ type: FETCH_TRANSACTIONS_REQUEST, payload: {} });
};

export const uploadRequest = () => async dispatch => {
	dispatch({ type: FETCH_UPLOAD_REQUEST, payload: {} });
};

export const uploadWithdrawals = (data) => async dispatch => {
	await axios.post('/api/withdrawalsUpload', data).then(res => {

		dispatch({ type: UPLOAD_WITHDRAWALS_SUCCESS, payload: res.data });
	}).catch(error => {
		
		dispatch({ type: UPLOAD_WITHDRAWALS_FAILD, payload: error.data });
	});
}