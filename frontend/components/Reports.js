import React, { Component } from 'react';
import ReportInverstors from './reports/ReportInverstors';
import ReportCountries from './reports/ReportCountries';
import ReportBalances from './reports/ReportBalances';
import ReportVerifications from './reports/ReportVerifications';

class Reports extends Component {
	constructor(props) {
		super(props);
		this.activeList = this.activeList.bind(this);
	}
	activeList() {
		console.log(this.props.match.params.listType)
		switch (this.props.match.params.listType) {
			case "investor":
				return <ReportInverstors />;
			case "country":
				return <ReportCountries />;
			case "balance":
				return <ReportBalances />;
			case "verification":
				return <ReportVerifications />;
			default:
				return <ReportInverstors />;
		}
	}
	render() {
		return (
			<div>
				{this.activeList()}
				<div className="fixed-action-btn" />
			</div>
		);
	}
};

export default Reports;
