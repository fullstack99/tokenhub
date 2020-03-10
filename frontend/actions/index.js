import axios from 'axios';
import {
	FETCH_USER,
	FETCH_INVESTORS,
	FETCH_INVESTOR,
	FETCH_INVESTOR_TRANSACTIOS,
	FETCH_TRANSACTIONS,
	FETCH_ICOS,
	FETCH_ICO,
	INITIAL_STATE,
	FETCH_INVESTOR_TOKENS,
	FETCH_INVESTOR_DOCUMENTS
} from './types';

// ico actions
export * from './icos';

// transaction actions
export * from './transaction'

// xRates actions
export * from './xRates'

export const fetchUser = () => async dispatch => {
	const res = await axios.get('/api/current_user');
	dispatch({ type: FETCH_USER, payload: res.data });
};

export const fetchInvestors = () => async dispatch => {
	const res = await axios.get('/api/investors');
	console.log(res)
	dispatch({ type: FETCH_INVESTORS, payload: res.data });
};

export const fetchInvestorById = id => async dispatch => {
	const res = await axios.get('/api/investor/' + id);
	dispatch({ type: FETCH_INVESTOR, payload: res.data });
};

export const switchMfa = (id, value) => async dispatch => {
	//console.log(value);
	const res = await axios.get(`/api/switchMfa/${id}/${value}`);
	dispatch({ type: FETCH_INVESTOR, payload: res.data });
};

export const switchAml = (id, value) => async dispatch => {
	//console.log(value);
	const res = await axios.get(`/api/switchAml/${id}/${value}`);
	dispatch({ type: FETCH_INVESTOR, payload: res.data });
};

export const switchKyc = (id, value) => async dispatch => {
	//console.log(value);
	const res = await axios.get(`/api/switchKyc/${id}/${value}`);
	dispatch({ type: FETCH_INVESTOR, payload: res.data });
};

export const switchAccreditation = (id, value) => async dispatch => {
	//console.log(value);
	const res = await axios.get(`/api/switchAccreditation/${id}/${value}`);
	dispatch({ type: FETCH_INVESTOR, payload: res.data });
};

export const fetchInvestorTransactions = id => async dispatch => {
	const res = await axios.get('/api/investorTransactions/' + id);
	dispatch({ type: FETCH_INVESTOR_TRANSACTIOS, payload: res.data });
};

export const fetchInvestorTokens = id => async dispatch => {
	const res = await axios.get('/api/investorTokens/' + id);
	dispatch({ type: FETCH_INVESTOR_TOKENS, payload: res.data });
};

export const fetchInvestorDocuments = id => async dispatch => {
	const res = await axios.get('/api/getDocuments/' + id);
	dispatch({ type: FETCH_INVESTOR_DOCUMENTS, payload: res.data });
};
export const initialStore = () => dispatch => {
	dispatch({ type: INITIAL_STATE, payload: [] });
}