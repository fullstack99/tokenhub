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

class ReportBalances extends Component {
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
								Header: 'Investor ID',
								width: 150,
								accessor: 'investor._id'
							},
							{
								Header: 'Investor e-mail',
								width: 150,
								id: 'email',
								accessor: d => (
									<Link to={'/investors/' + d.investor._id}>
										{d.investor.email}
									</Link>
								)
							},
							{
								Header: 'Investor Name',
								maxWidth: 150,
								id: 'fullname',
								accessor: d => d.investor.firstName + ' ' + d.investor.lastName
							},
							{
								Header: 'ICO Name',
								accessor: 'ico.name',
								id: "ico",
								maxWidth: 150
							},
							{
								Header: 'Type',
								width: 150,
								accessor: 'transaction.type',
								id: 'type'
							},
							{
								Header: 'Tokens',
								maxWidth: '150',
								id: 'tokens',
								accessor: d => {
									let period = d.ico.periods.filter(period => {
										return (
											d.transaction.created_at > period.dateStart &&
											d.transaction.created_at < period.dateEnd
										);
									})[0];
									if (!period) {
										period = d.ico.periods[d.ico.periods.length - 1];
									}
									const tokens =
										d.transaction.amount *
										d.transaction.xRate /
										period.tokenPrice;
									return tokens;
								}
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
						pivotBy={["ico", "type", "tokens"]}
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

export default connect(mapStateToProps, actions)(ReportBalances);
