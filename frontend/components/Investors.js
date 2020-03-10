import React from 'react';
import { Link } from 'react-router-dom';
import InvestorsList from './investors/InvestorsList';

const Dashboard = () => {
	return (
		<div>
			<InvestorsList />
			<div className="fixed-action-btn" />
		</div>
	);
};

export default Dashboard;
