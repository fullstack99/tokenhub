import axios from 'axios';
import { push } from 'react-router-redux';
import {
	FETCH_ALL_ICOS,
	FETCH_SELECTED_ICO,
	FETCH_ICO_CLOSED,
	FETCH_ICO_CLOSED_CONFIRM_SUCCESS,
	FETCH_ICO_CLOSED_CONFIRM_FAIL,
	FETCH_ICO_CLOSED_REQUEST,
	FETCH_ICO_ADD_SUCCESS,
	FETCH_ICO_ADD_FAILD,
	FETCH_ICO_UPDATE_SUCCESS,
	FETCH_ICO_UPDATE_FAILD
} from './types';

export const fetchAllIcos = () => async dispatch => {
	const res = await axios.get('/api/ico');
	dispatch({ type: FETCH_ALL_ICOS, payload: res.data });
};

export const fetchIcoById = (id) => async dispatch => {
	const res = await axios.get('/api/ico/' + id);
	dispatch({ type: FETCH_SELECTED_ICO, payload: res.data });
};

export const fetchIcoClosed = (id, goTo) => async dispatch => {
	axios.get('/api/ico/' + id + '/close')
		.then((res) => {
			dispatch({ type: FETCH_ICO_CLOSED, payload: res.data });
			goTo();
		});
};

export const fetchIcoClosedConfirm = (data, goTo) => async dispatch => {
	console.log(data)
	axios.post('/api/ico/' + data[0].ico + '/close/confirm', data)
		.then((res) => {
			dispatch({ type: FETCH_ICO_CLOSED_CONFIRM_SUCCESS, payload: true });
			goTo();
		})
		.catch((error) => {
			dispatch({ type: FETCH_ICO_CLOSED_CONFIRM_FAIL, payload: false });
			goTo();
		});
};

export const fetchRequest = () => async dispatch => {
	dispatch({ type: FETCH_ICO_CLOSED_REQUEST, payload: "" });
};

export const fetchIcoAdd = (data) => async dispatch => {
	console.log(data)
	axios.post('/api/ico', data)
		.then((res) => {
			dispatch({ type: FETCH_ICO_ADD_SUCCESS, payload: { data: res.data, isAdded: true } });
		})
		.catch((error) => {
			dispatch({ type: FETCH_ICO_ADD_FAILD, payload: { data: error, isAdded: false } });
		});
};

export const fetchIcoUpdate = (data, goTo) => async dispatch => {
	console.log(data)
	axios.put('/api/ico/' + data._id, data)
		.then((res) => {
			console.log(res)
			dispatch({ type: FETCH_ICO_UPDATE_SUCCESS, payload: true });
			goTo(res.data);
		})
		.catch((error) => {
			dispatch({ type: FETCH_ICO_UPDATE_FAILD, payload: false });
			goTo(error);
		});
};