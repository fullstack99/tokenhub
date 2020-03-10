import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';

import * as actions from '../../actions/transaction';
import LoadingBar from '../loadingBar/LoadingBar';
import { Link } from 'react-router-dom';
import { CSVLink, CSVDownload } from 'react-csv';

const ReactToastr = require('react-toastr');
const { ToastContainer } = ReactToastr;
const ToastMessageFactory = React.createFactory(
	ReactToastr.ToastMessage.animation
);

class ReportVerifications extends Component {
	constructor(props) {
		super(props);
		this.tempData = [];
		this.state = {

			Headers: [
				{ label: 'Date', key: 'time-id' },
				{ label: 'Investor ID', key: 'investor._id' },
				{ label: 'Investor e-mail', key: 'email_value' },
				{ label: 'Investor Name', key: 'fullname' },
				{ label: 'ICO Name', key: 'ico.name' },
				{ label: 'Currency', key: 'currency' },
				{ label: 'Amount', key: 'amount' },
				{ label: 'X-rate', key: 'transaction.xRate' },
				{ label: 'Tokens', key: 'tokens' },
				{ label: 'Type', key: 'type' },
				{ label: 'Investors wallet', key: 'investor_wallet_value' },
				{ label: 'txhash/transaction id', key: 'transaction_id_value' },
				{ label: 'Status', key: 'status' }
			],
			csvData: [],
			isOpen: false,
			selectedTransacton: {}
		};
		this.csvDataCreate = this.csvDataCreate.bind(this);
	}

	componentWillMount() {
		this.props.fetchTransactions();
	}

	csvDataCreate() {
		this.setState({ csvData: this.tempData });
	}

	componentWillReceiveProps = nextProps => {
		if (nextProps.transactions.refundedFlag === true) {
			this.refs.message.success('', 'Update Success', {
				timeOut: 2000,
				extendedTimeOut: 2000
			});
			this.props.transactionRequest();
		} else if (nextProps.transactions.refundedFlag === false) {
			this.refs.message.error('', 'Update Fail', {
				timeOut: 2000,
				extendedTimeOut: 2000
			});
			this.props.transactionRequest();
		}
	};

	filterCaseInsensitive(filter, row) {
		const id = filter.pivotId || filter.id;
		if (row[id] === undefined) {
			return true;
		} else {
			if (id === 'email') {
				return row[id].props.children !== undefined
					? String(row[id].props.children.toLowerCase()).includes(
						filter.value.toLowerCase()
					)
					: false;
			} else {
				return row[id] !== undefined
					? String(row[id].toString().toLowerCase()).includes(filter.value.toLowerCase())
					: true;
			}
		}
	}

	onRefresh() {
		this.props.fetchTransactions();
	}

	render() {
		let { csvData, Headers } = this.state;
		let { transactions } = this.props;

		if (transactions.isFetched) {

			return (
				<div>
					<div onClick={this.csvDataCreate}>
						<CSVLink
							data={csvData}
							headers={Headers}
							filename="transactions.csv"
						>
							<i className="tine material-icons">archive</i>
						</CSVLink>
					</div>
					<ToastContainer
						ref="message"
						toastMessageFactory={ToastMessageFactory}
						className="toast-top-right"
					/>

					<ReactTable
						columns={[
							{
								Header: 'ncAml_status',
								width: 150,
								accessor: 'investor.verification.ncAml_status'
							},
							{
								Header: 'ncKyc_status',
								width: 150,
								accessor: "investor.verification.ncKyc_status"
							},
							{
								Header: 'idmKyc_status',
								maxWidth: 150,
								accessor: "investor.verification.idmKyc_status"
							},
							{
								Header: 'amlOverride',
								accessor: 'investor.verification.amlOverride',
								id: "amlOverride",
								maxWidth: 150
							},
							{
								Header: 'kycOverride',
								accessor: 'investor.verification.kycOverride',
								id: "kycOverride",
								maxWidth: 150
							},
							{
								Header: 'ICO Name',
								accessor: 'ico.name',
								id: "ico",
								maxWidth: 150
							}

						]}
						data={transactions.data}
						filterable
						defaultFilterMethod={this.filterCaseInsensitive}
						defaultSorted={[
							{
								id: 'time-id',
								desc: true
							}
						]}
						defaultPageSize={20}
						className="-striped -highlight"
						pivotBy={["ico", "amlOverride", "kycOverride"]}
					/>
					<div
						className="fixed-action-btn"
						style={{ bottom: '45px', right: '24px' }}
					>
						<a
							className="btn-floating btn-large waves-effect waves-light red"
							onClick={this.onRefresh.bind(this)}
						>
							<i className="material-icons">refresh</i>
						</a>
					</div>
				</div>
			);
		} else return <LoadingBar type="spinner" />;
	}
}

function mapStateToProps(state) {
	return {
		transactions: state.transactions,
		auth: state.auth
	};
}

export default connect(mapStateToProps, actions)(ReportVerifications);
