import axios from 'axios';

import { FETCH_ALL_ADMIN_LOGS, FETCH_ADMIN_LOGS_REQUEST } from './types';

export const fetchAllAdminLogs = (data) => async dispatch => {
//	dispatch(fetchAdminRequest())
	const res = await axios.post('/api/adminLog', data);
	dispatch({ type: FETCH_ALL_ADMIN_LOGS, payload: res.data.data, length: res.data.length });
};

export const fetchAdminRequest = () => async dispatch => {
	dispatch({ type: FETCH_ADMIN_LOGS_REQUEST, payload: []  });
};