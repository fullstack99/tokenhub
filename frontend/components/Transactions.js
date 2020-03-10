import React from 'react';
import TransactionsList from './transactions/TransactionsList';

const Transactions = (props) => {
	return (
		<div>
			<TransactionsList {...props} />
			<div className="fixed-action-btn" />
		</div>
	);
};

export default Transactions;
