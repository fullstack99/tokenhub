import axios from 'axios';
import {
	FETCH_ALL_XRATES,
    FETCH_CUSTOM_XRATES,
    FETCH_XRATES,
    FETCH_UPDATED_XRATES,
    FETCH_UPDATED_XRATE_SUCCESS,
	FETCH_UPDATED_XRATE_FAIL,
    FETCH_CREATED_XRATE,
	FETCH_REQUEST
} from './types';

export const fetchARequest = () => async dispatch => {
	dispatch({ type: FETCH_REQUEST, payload: {} });
};

export const fetchAllXRates = () => async dispatch => {
	const res = await axios.get('/api/xRate');
	dispatch({ type: FETCH_ALL_XRATES, payload: res.data });
};

export const fetchCustomXRates = (rate) => async dispatch => {
	const res = await axios.post('/api/xRate/custom', { rate: rate });
	dispatch({ type: FETCH_CUSTOM_XRATES, payload: res.data });
};

export const fetchUpdateXRates = () => async dispatch => {
	const res = await axios.get('/api/xrates/update');
	dispatch({ type: FETCH_UPDATED_XRATES, payload: res.data });
};

export const fetchXRate = (currency, date) => async dispatch => {
	const res = await axios.get(`/api/xRate/getRate/${currency}/${date}`);
	dispatch({ type: FETCH_XRATES, payload: res.data });
};

export const fetchUpdateXRate = (ico, date, currency, xRate) => async dispatch => {
	axios.put('/api/xRate/update', {
		ico: ico,
		date: date,
		currency: currency,
		xRate: xRate
	}).then(res => {
		dispatch({ type: FETCH_UPDATED_XRATE_SUCCESS, payload: res.data });
	}).catch(error => {
		dispatch({ type: FETCH_UPDATED_XRATE_FAIL, error: error.message });
	})
};

export const fetchCreatedXRate = () => async dispatch => {
	const res = await axios.get('/api/xRate/create');
	dispatch({ type: FETCH_CREATED_XRATE, payload: res.data });
};