import 'materialize-css/dist/css/materialize.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware, routerReducer } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import logger from 'redux-logger'
import reduxThunk from 'redux-thunk';

import App from './components/App';
import reducers from './reducers';

import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

window.axios = axios;

const history = createHistory();
const store = createStore(
	reducers,
	{},
	applyMiddleware(
		logger,
		routerMiddleware(history),
		reduxThunk
	)
);

ReactDOM.render(
	<Provider store={store}>
		<App history={history}/>
	</Provider>,
	document.querySelector('#root')
);
