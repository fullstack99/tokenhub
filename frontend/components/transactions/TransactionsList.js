import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { CSVLink, CSVDownload } from 'react-csv';
import ReactTable from 'react-table';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import { Button, Glyphicon } from 'react-bootstrap';
import moment from 'moment';
import _ from 'lodash';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';

import * as actions from '../../actions/transaction';
import LoadingBar from '../loadingBar/LoadingBar';
import RefundTransaction from './RefundTransaction';

const ReactToastr = require('react-toastr');
const { ToastContainer } = ReactToastr;
const ToastMessageFactory = React.createFactory(
	ReactToastr.ToastMessage.animation
);

class TransactionsList extends Component {
	constructor(props) {
		super(props);
		this.handleEvent = this.handleEvent.bind(this);
		this.tempData = [];
		this.state = {
			ranges: {
				Today: [moment(), moment()],
				Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
				'Last 7 Days': [moment().subtract(6, 'days'), moment()],
				'Last 30 Days': [moment().subtract(29, 'days'), moment()],
				'This Month': [moment().startOf('month'), moment().endOf('month')],
				'Last Month': [
					moment()
						.subtract(1, 'month')
						.startOf('month'),
					moment()
						.subtract(1, 'month')
						.endOf('month')
				]
			},
			startDate: undefined,
			endDate: undefined,
			Headers: [
				{ label: 'Date', key: 'time-id' },
				{ label: 'Investor ID', key: 'investor._id' },
				{ label: 'Investor e-mail', key: 'email_value' },
				{ label: 'Investor Name', key: 'fullname' },
				{ label: 'ICO Name', key: 'ico.name' },
				{ label: 'Investor Country', key: 'investor.country' },
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
		this.renderEditable = this.renderEditable.bind(this);
	}

	renderEditable(cellInfo) {
		return (
			// <input />
			<div
				style={{ backgroundColor: '#fafafa' }}
				contentEditable
				suppressContentEditableWarning
				onKeyPress={event => {
					if (
						(event.charCode != 46 ||
							event.target.innerHTML.indexOf('.') != -1) &&
						(event.charCode < 48 || event.charCode > 57)
					) {
						event.preventDefault();
					}
					if (event.key === 'Enter') {
						const data = [...this.props.transactions.data];
						const current_data = data[cellInfo.index].transaction.xRate;
						data[cellInfo.index].transaction.xRate = parseFloat(
							event.target.innerHTML
						);
						if (data[cellInfo.index].transaction.xRate !== current_data) {
							data[cellInfo.index].transaction.xRate = parseFloat(
								event.target.innerHTML
							);
							this.props.updateTransaction(data[cellInfo.index].transaction);
						}
					}
				}}
				onBlur={e => {
					const data = [...this.props.transactions.data];
					e.target.innerHTML = data[cellInfo.index].transaction.xRate;
				}}
				dangerouslySetInnerHTML={{
					__html: this.props.transactions.data[cellInfo.index].transaction.xRate
				}}
			/>
		);
	}

	componentWillMount() {
		this.props.fetchTransactions();
	}

	csvDataCreate() {
		this.setState({ csvData: this.tempData });
	}

	componentWillReceiveProps = nextProps => {
		if (
			nextProps.transactions.refundedFlag === true ||
			nextProps.transactions.updatedFlag === true
		) {
			this.refs.message.success('', 'Update Success', {
				timeOut: 2000,
				extendedTimeOut: 2000
			});
			this.props.transactionRequest();
		} else if (
			nextProps.transactions.refundedFlag === false ||
			nextProps.transactions.updatedFlag === false
		) {
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
			if (
				id === 'email' ||
				id === 'investor_wallet' ||
				id === 'transaction_id'
			) {
				console.log(row[id]);
				return row[id].props.children !== undefined
					? String(row[id].props.children.toLowerCase()).includes(
							filter.value.toLowerCase()
						)
					: true;
			} else {
				return row[id] !== undefined
					? String(row[id].toString().toLowerCase()).includes(
							filter.value.toLowerCase()
						)
					: true;
			}
		}
	}

	handleEvent(event, picker) {
		this.setState({
			startDate: picker.startDate,
			endDate: picker.endDate
		});
	}

	// show and hide modal
	toggleModal = data => {
		this.setState({
			isOpen: !this.state.isOpen
		});
		this.setState({ selectedTransacton: data });
	};

	onRefresh() {
		this.props.fetchTransactions();
	}

	render() {
		let { startDate, endDate, csvData, Headers } = this.state;
		let { transactions, auth } = this.props;
		let label = '';
		let start = (startDate && startDate.format('YYYY-MM-DD')) || '';
		let end = (endDate && endDate.format('YYYY-MM-DD')) || '';

		label = start + ' - ' + end;
		let locale = {
			format: 'YYYY-MM-DD',
			cancelLabel: 'Clear'
		};

		if (start === end) {
			label = start;
		}

		if (transactions.isFetched) {
			transactions.data = transactions.data.filter(transaction => {
				return (
					transaction.transaction.type === 'buy' ||
					transaction.transaction.type === 'refund'
				);
			});
			if (this.props.match.params.icoId && this.props.match.params.investorId) {
				transactions.data = this.props.transactions.data.filter(transaction => {
					return (
						transaction.ico._id === this.props.match.params.icoId &&
						transaction.investor._id === this.props.match.params.investorId
					);
				});
			}
			if(!_.isNil(auth._ico)) {
				let temp =[];
				transactions.data.map(transaction => {
					if(transaction.ico._id == auth._ico) {
						temp.push(transaction);
					}
				})
				transactions.data = temp;
			}
			// console.log(transactions.data);
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
					{this.state.isOpen && (
						<div className="overlay-section">
							<RefundTransaction
								show={this.state.isOpen}
								onClose={this.toggleModal}
								selectedTransacton={this.state.selectedTransacton}
							/>
						</div>
					)}
					<ReactTable
						columns={[
							{
								Header: 'Date',
								id: 'time-id',
								minWidth: 150,
								accessor: d => {
									var dateTime = d.transaction.created_at.split('T');
									var dateBits = dateTime[0].split('-');
									var timeBits = dateTime[1].split(':');
									return (
										dateBits[0] +
										'-' +
										dateBits[1] +
										'-' +
										dateBits[2] +
										' ' +
										timeBits[0] +
										':' +
										timeBits[1] +
										':' +
										timeBits[2].substring(0, 2)
									);
								},
								// accessor:"transaction.created_at",
								filterMethod: (filter, row) => {
									if (filter.value.startDate === undefined) {
										return true;
									} else {
										let startDate = new Date(
											filter.value.startDate.format('YYYY-MM-DD')
										);
										let rowDate = new Date(row[filter.id]);
										let endDate = new Date(
											filter.value.endDate.format('YYYY-MM-DD')
										);
										return rowDate >= startDate && rowDate <= endDate;
									}
								},
								Filter: ({ filter, onChange }) => (
									<DateRangePicker
										locale={locale}
										ranges={this.state.ranges}
										onApply={(event, picker) => {
											this.setState({
												startDate: picker.startDate,
												endDate: picker.endDate
											});
											let pickerProps = {
												startDate: picker.startDate,
												endDate: picker.endDate
											};
											onChange(pickerProps);
										}}
										onCancel={(event, picker) => {
											this.setState({
												startDate: undefined,
												endDate: undefined
											});
											let pickerProps = {
												startDate: undefined,
												endDate: undefined
											};
											onChange(pickerProps);
										}}
									>
										<div className="input-group">
											<input
												type="text"
												className="form-control date-input"
												value={label}
												readOnly
											/>
											<span className="input-group-btn">
												<Button className="default date-range-toggle date-button">
													<Glyphicon glyph="calendar" />
												</Button>
											</span>
										</div>
									</DateRangePicker>
								)
							},
							{
								Header: 'Investor ID',
								width: 120,
								accessor: 'investor._id'
							},
							{
								Header: 'Investor e-mail',
								width: 120,
								id: 'email',
								accessor: d => (
									<Link to={'/investors/' + d.investor._id}>
										{d.investor.email}
									</Link>
								)
							},
							{
								Header: 'Investor ID',
								width: 120,
								accessor: 'investor.country'
							},
							{
								Header: 'Investor Name',
								maxWidth: 120,
								id: 'fullname',
								accessor: d => d.investor.firstName + ' ' + d.investor.lastName
							},
							{
								Header: 'ICO Name',
								accessor: 'ico.name',
								maxWidth: 120
							},
							{
								Header: 'Currency',
								width: 120,
								accessor: 'transaction.currency',
								id: 'currency',
								filterMethod: (filter, row) => {
									if (filter.value === 'all') {
										return true;
									}
									if (filter.value === 'USD') {
										return row[filter.id] === 'USD';
									}
									if (filter.value === 'BTC') {
										return row[filter.id] === 'BTC';
									}
									if (filter.value === 'ETH') {
										return row[filter.id] === 'ETH';
									}
									if (filter.value === 'TKN') {
										return row[filter.id] === 'TKN';
									}
								},
								Filter: ({ filter, onChange }) => (
									<select
										onChange={event => onChange(event.target.value)}
										style={{ width: '100%', display: 'block' }}
										value={filter ? filter.value : 'all'}
									>
										<option value="all">Show All</option>
										<option value="USD">USD</option>
										<option value="BTC">BTC</option>
										<option value="ETH">ETH</option>
										<option value="TKN">TKN</option>
									</select>
								)
							},
							{
								Header: 'Amount',
								accessor: 'transaction.amount',
								id: 'amount',
								filterMethod: (filter, row) => {
									let filter_val = filter.value.split('-');
									if (filter_val.length > 1) {
										return (
											row[filter.id] >= filter_val[0] &&
											row[filter.id] <= filter_val[1]
										);
									}
									if (filter_val.length === 1) {
										return row[filter.id] >= filter_val[0];
									}
								}
							},
							{
								Header: 'X-rate',
								accessor: 'transaction.xRate',
								Cell: this.renderEditable,
								filterable: false
							},
							{
								Header: 'Tokens',
								id: 'tokens',
								accessor: d => {
									//console.log(d.transaction._id);
									//console.log(d.ico);
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
							},
							{
								Header: 'Type',
								accessor: 'transaction.type',
								id: 'type',
								filterMethod: (filter, row) => {
									if (filter.value === 'all') {
										return (
											row[filter.id] === 'buy' || row[filter.id] === 'refund'
										);
									}
									if (filter.value === 'buy') {
										return row[filter.id] === 'buy';
									}
									if (filter.value === 'refund') {
										return row[filter.id] === 'refund';
									}
									// if (filter.value === 'withdraw') {
									// 	return row[filter.id] === 'withdraw';
									// }
								},
								Filter: ({ filter, onChange }) => (
									<select
										onChange={event => onChange(event.target.value)}
										style={{ width: '100%', display: 'block' }}
										value={filter ? filter.value : 'all'}
									>
										<option value="all">Show All</option>
										<option value="buy">Buy</option>
										<option value="refund">Refund</option>
										{/* <option value="withdraw">Withdraw</option> */}
									</select>
								)
							},
							{
								Header: 'Investors wallet',
								id: 'investor_wallet',
								accessor: d => {
									let link = '';
									if (
										d.transaction.currency === 'ETH' ||
										d.transaction.currency === 'BTC'
									) {
										if (d.transaction.currency === 'ETH') {
											link = 'https://etherscan.io/tx/' + d.wallet.ethAddress;
											return (
												<Link to={link} target="_blank">
													{d.wallet.ethAddress}
												</Link>
											);
										} else if (d.transaction.currency === 'BTC') {
											link = 'https://blockchain.info/tx' + d.wallet.btcAddress;
											return (
												<Link to={link} target="_blank">
													{d.wallet.btcAddress}
												</Link>
											);
										}
									}
								}
							},
							{
								Header: 'txhash/transaction id',
								id: 'transaction_id',
								accessor: d => {
									let link = '';
									if (
										d.transaction.currency === 'ETH' ||
										d.transaction.currency === 'BTC'
									) {
										if (d.transaction.currency === 'ETH') {
											link = 'https://etherscan.io/tx/' + d.transaction.txId;
										}
										if (d.transaction.currency === 'BTC') {
											link = 'https://blockchain.info/tx' + d.transaction.txId;
										}
										return (
											<Link to={link} target="_blank">
												{d.transaction.txId}
											</Link>
										);
									}
								}
							},
							{
								Header: 'Status',
								accessor: 'transaction.status',
								id: 'status',
								// Cell: ({ value }) => (value >= 21 ? "Yes" : "No"),
								filterMethod: (filter, row) => {
									if (filter.value === 'all') {
										return true;
									}
									if (filter.value === 'pending') {
										return row[filter.id] === 'pending';
									}
									if (filter.value === 'confirmed') {
										return row[filter.id] === 'confirmed';
									}
								},

								Filter: ({ filter, onChange }) => (
									<select
										onChange={event => onChange(event.target.value)}
										style={{ width: '100%', display: 'block' }}
										value={filter ? filter.value : 'all'}
									>
										<option value="all">Show All</option>
										<option value="pending">Pending</option>
										<option value="confirmed">Confirmed</option>
									</select>
								)
							},
							{
								Header: 'Action',
								id: 'action',
								accessor: d => {
									return d.transaction.type == 'buy' ? (
										<i
											className="material-icons"
											onClick={() => this.toggleModal(d)}
										>
											cached
										</i>
									) : null;
								},
								filterable: false,
								style: {
									textAlign: 'center'
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
						getTbodyProps={(state, rowInfo, column) => {
							console.log(state);
							this.tempData = Object.assign([], state.sortedData);
							this.tempData.map(item => {
								if (item.email) item.email_value = item.email.props.children;
								if (item.transaction_id)
									item.transaction_id_value =
										item.transaction_id.props.children;
								if (item.investor_wallet)
									item.investor_wallet_value =
										item.investor_wallet.props.children;
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
		} else return <LoadingBar type="spinner" />;
	}
}

function mapStateToProps(state) {
	return {
		transactions: state.transactions,
		auth: state.auth
	};
}

export default connect(mapStateToProps, actions)(TransactionsList);
