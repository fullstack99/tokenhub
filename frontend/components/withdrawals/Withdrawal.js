import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { CSVLink, CSVDownload } from 'react-csv';

import * as actions from '../../actions/withdrawals';

import LoadingBar from '../loadingBar/LoadingBar';

import './Withdrawal.css';

const ReactToastr = require('react-toastr');
const { ToastContainer } = ReactToastr;
const ToastMessageFactory = React.createFactory(
	ReactToastr.ToastMessage.animation
);

class Withdrawals extends Component {
	constructor(props) {
		super(props);
		this.csvDataCreate = this.csvDataCreate.bind(this);
		this.tempData = [];
		this.state = {
			Headers: [
				{ label: 'Date', key: 'created_at' },
				{ label: 'Email', key: 'email_value' },
				{ label: 'Country', key: '_investor.country' },
				{ label: 'TransactionID', key: '_id' },
				{ label: 'Ico', key: 'currency' },
				{ label: 'Amount', key: 'amount' },
				{ label: 'Status', key: 'status' },
				{ label: 'Destination', key: 'address' },
				{ label: 'TxId', key: 'txId' }
			],
			csvData: [],
			data: [],
			changedRow: []
		};

		this.renderEditable = this.renderEditable.bind(this);
	}

	componentWillMount() {
		this.props.getWithdrawalTransactions();
	}

	componentWillReceiveProps(nextProps) {
		console.log(nextProps);
		if (
			nextProps.withdrawal.data.length > 0 &&
			nextProps.withdrawal.isFetched
		) {
			this.setState({ data: nextProps.withdrawal.data });
		}

		if (nextProps.transactions.updatedFlag === true) {
			this.refs.message.success('', 'Update Success', {
				timeOut: 2000,
				extendedTimeOut: 2000
			});
			this.props.transactionRequest();
		} else if (nextProps.transactions.updatedFlag === false) {
			this.refs.message.error('', 'Update Fail', {
				timeOut: 2000,
				extendedTimeOut: 2000
			});
			this.props.transactionRequest();
		}
	}

	onRefresh() {
		this.props.getWithdrawalTransactions();
	}
	filterCaseInsensitive(filter, row) {
		const id = filter.pivotId || filter.id;
		if (id == 'email') {
			return !_.isNil(id) && row[id] != ''
				? String(row[id].props.children.toLowerCase()).includes(
						filter.value.toLowerCase()
					)
				: true;
		} else {
			return String(row[id])
				.toLowerCase()
				.includes(filter.value.toLowerCase());
		}
	}

	creatTemplate(data) {
		const value = data;
		let html =
			`<select class="select" onChange="this.updateTransaction()">
                        <option value="pending" ` +
			(value === 'pending' ? 'selected' : '') +
			`>Pending</option>
                        <option value="cancelled" ` +
			(value === 'cancelled' ? 'selected' : '') +
			`>Cancelled</option>
                        <option value="confirmed" ` +
			(value === 'confirmed' ? 'selected' : '') +
			`>Confirmed</option>
                    </select>`;
		return { __html: html };
	}

	updateTransaction(value, e) {
		const data = {
			_id: value._id,
			status: e.target.value
		};
		this.props.updateTransaction(data);
	}
	renderEditable(cellInfo) {
		const that = this;
		if (this.state.data.length > 0) {
			const cellData = this.state.data[cellInfo.index][cellInfo.column.id];
			return (
				<div
					style={{ backgroundColor: '#fafafa' }}
					contentEditable
					suppressContentEditableWarning
					onBlur={e => {
						const data = [...this.state.data];
						data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
						this.setState({ data });
					}}
				>
					<select
						className="select"
						defaultValue={cellData}
						onChange={this.updateTransaction.bind(
							this,
							this.state.data[cellInfo.index]
						)}
					>
						<option
							value="pending"
							selected={cellData === 'pending' ? true : false}
						>
							pending
						</option>
						<option
							value="cancelled"
							selected={cellData === 'cancelled' ? true : false}
						>
							cancelled
						</option>
						<option
							value="confirmed"
							selected={cellData === 'confirmed' ? true : false}
						>
							confirmed
						</option>
						<option
							value="unconfirmed"
							selected={cellData === 'unconfirmed' ? true : false}
						>
							unconfirmed
						</option>
					</select>
				</div>
			);
		} else {
			return <LoadingBar type="spinner" />;
		}
	}

	csvDataCreate() {
		this.setState({ csvData: this.tempData });
	}

	render() {
		const { withdrawal, auth } = this.props;
		let { csvData, Headers } = this.state;
		if (withdrawal.isFetched) {
			if (this.props.match.params.icoId && this.props.match.params.investorId) {
				withdrawal.data = this.props.withdrawal.data.filter(withdrawal => {
					if (withdrawal._investor) {
						return (
							withdrawal._ico === this.props.match.params.icoId &&
							withdrawal._investor._id === this.props.match.params.investorId
						);
					}
				});
			}

			if(!_.isNil(auth._ico)) {
				let temp =[]
				withdrawal.data.map(withdrawal => {
					if(withdrawal._ico == auth._ico) {
						temp.push(withdrawal)
					}
				});
				withdrawal.data = temp;
			}

			return (
				<div className="withdrawal-component">
					<div onClick={this.csvDataCreate}>
						<CSVLink
							data={csvData}
							headers={Headers}
							filename="withdrawals.csv"
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
								Header: 'Date',
								id: 'created_at',
								minWidth: 100,
								accessor: d => d.created_at.substring(0, 10)
							},
							{
								Header: 'Id',
								accessor: '_id',
								minWidth: 100
							},
							{
								Header: 'E-mail',
								id: 'email',
								width: 300,
								accessor: d => {
									return d._investor ? (
										<Link to={'/investors/' + d._investor._id}>
											{d._investor.email}
										</Link>
									) : (
										''
									);
								}
							},
							{
								Header: 'Country',
								accessor: '_investor.country',
								minWidth: 100
							},
							{
								Header: 'ICO',
								accessor: 'currency',
								maxWidth: 100
							},
							{
								Header: 'Amount',
								accessor: 'amount',
								maxWidth: 100
							},
							{
								Header: 'Status',
								accessor: 'status',
								maxWidth: 100,
								Cell: this.renderEditable
							},
							{
								Header: 'Destination',
								accessor: 'address'
							},
							{
								Header: 'TxId',
								accessor: 'txId'
							}
						]}
						data={withdrawal.data}
						filterable
						defaultFilterMethod={this.filterCaseInsensitive}
						defaultPageSize={20}
						className="-striped -highlight"
						getTbodyProps={(state, rowInfo, column) => {
							this.tempData = Object.assign([], state.sortedData);
							this.tempData.map(item => {
								if (item.email) item.email_value = item.email.props.children;
							});
							return true;
						}}
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
		} else {
			return <LoadingBar type="spinner" />;
		}
	}
}

function mapStateToProps(state) {
	return {
		withdrawal: state.withdrawal,
		transactions: state.transactions,
		auth: state.auth
	};
}

export default connect(mapStateToProps, actions)(Withdrawals);
