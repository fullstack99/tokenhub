import axios from 'axios';
import {
	UPLOAD_TRANSACTIONS_SUCCESS,
	UPLOAD_TRANSACTIONS_FAILD,
	FETCH_WITHDRAWAL_REFUND_TRANSACTIONS_SUCCESS,
	FETCH_WITHDRAWAL_REFUND_TRANSACTIONS_FAIL,
	FETCH_TRANSACTIONS_REQUEST,
	FETCH_TRANSACTIONS_SUCCESS,
	FETCH_TRANSACTIONS_FAIL,
	FETCH_UPDATED_TRANSACTION
} from './types';

export const fetchTransactions = () => async dispatch => {
	await axios.get('/api/transactions')
		.then(res => {
			dispatch({ type: FETCH_TRANSACTIONS_SUCCESS, payload: res.data });
		})
		.catch(error => {
			dispatch({ type: FETCH_TRANSACTIONS_FAIL, error: error });
		})

};

export const uploadTransactions = (data) => async dispatch => {
	await axios.post('/api/transactionsUpload', data).then(res => {
		dispatch({ type: UPLOAD_TRANSACTIONS_SUCCESS, payload: res.data })
	}).catch(error => {
		dispatch({ type: UPLOAD_TRANSACTIONS_FAILD, payload: error.data })
	});
};

export const updateTransaction = (data) => async dispatch => {
	const res = await axios.put('/api/transaction/' + data._id, data);
	dispatch({ type: FETCH_UPDATED_TRANSACTION, payload: res.data });
};

export const refundTransaction = (data) => async dispatch => {
	await axios.post('/api/transactions', data)
		.then(res => {
			dispatch({ type: FETCH_WITHDRAWAL_REFUND_TRANSACTIONS_SUCCESS, payload: res.data });
		})
		.catch(error => {
			dispatch({ type: FETCH_WITHDRAWAL_REFUND_TRANSACTIONS_FAIL, error: error });
		})
};

export const transactionRequest = () => async dispatch => {
	dispatch({ type: FETCH_TRANSACTIONS_REQUEST, payload: {} });
};

export const transactionRequestFail = () => async dispatch => {
	dispatch({ type: FETCH_WITHDRAWAL_REFUND_TRANSACTIONS_FAIL, payload: {} });
};