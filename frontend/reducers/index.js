import { combineReducers } from 'redux';
import { reducer as reduxForm } from 'redux-form';
import { routerReducer } from 'react-router-redux';

import authReducer from './authReducer';
import investorsReducer from './investorsReducer';
import investorReducer from './investorReducer';
import investorTransactionsReducer from './investorTransactionsReducer';
import transactionsReducer from './transactionsReducer';
import icosReducer from './icosReducer';
import icoReducer from './icoReducer';
import xRatesReducer from './xRatesReducer';
import adminLogReducer from './adminLogReducer';
import withdrawalReducer from './withdrawalReducer';
import distributionReducer from './distributionReducer';
import investorTokens from './investorTokens';
import investorDocuments from './investorDocuments';
export default combineReducers({
	router: routerReducer,
	auth: authReducer,
	form: reduxForm,
	investors: investorsReducer,
	investor: investorReducer,
	investorTransactions: investorTransactionsReducer,
	transactions: transactionsReducer,
	icos: icosReducer,
	ico: icoReducer,
	xRates: xRatesReducer,
	adminLog: adminLogReducer,
	withdrawal: withdrawalReducer,
	distribution: distributionReducer,
	investorTokens: investorTokens,
	investorDocuments: investorDocuments
});
