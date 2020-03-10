import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { CSVLink, CSVDownload } from 'react-csv';

import * as actions from '../../actions/distributions';

import LoadingBar from '../loadingBar/LoadingBar';

import './Withdrawal.css';

const ReactToastr = require('react-toastr');
const { ToastContainer } = ReactToastr;
const ToastMessageFactory = React.createFactory(
	ReactToastr.ToastMessage.animation
);

class Distributions extends Component {
	constructor(props) {
		super(props);
		this.csvDataCreate = this.csvDataCreate.bind(this);
		this.tempData = [];
		this.state = {
			Headers: [
				{ label: 'Date', key: 'created_at' },
				{ label: 'Email', key: 'email_value' },
				{ label: 'Ico', key: 'currency' },
				{ label: 'Amount', key: 'amount' }
			],
			csvData: [],
			data: [],
			changedRow: []
		};
	}

	componentWillMount() {
		this.props.getDistributionTransactions();
	}

	onRefresh() {
		this.props.getDistributionTransactions();
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

	csvDataCreate() {
		this.setState({ csvData: this.tempData });
	}

	render() {
		const { distribution, auth } = this.props;
		let { csvData, Headers } = this.state;
		if (distribution.isFetched) {
			if (this.props.match.params.icoId && this.props.match.params.investorId) {
				distribution.data = this.props.distribution.data.filter(
					distribution => {
						if (distribution._investor) {
							return (
								distribution._ico === this.props.match.params.icoId &&
								distribution._investor._id === this.props.match.params.investorId
							);
						}
					}
				);
			}

			if(!_.isNil(auth._ico)) {
				let temp =[];
				distribution.data.map(distribution => {
					if(distribution._ico == auth._ico) {
						temp.push(distribution)
					}
				});
				distribution.data = temp;
			}

			return (
				<div className="withdrawal-component">
					<div onClick={this.csvDataCreate}>
						<CSVLink
							data={csvData}
							headers={Headers}
							filename="distributions.csv"
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
								Header: 'ICO',
								accessor: 'currency',
								maxWidth: 100
							},
							{
								Header: 'Amount',
								accessor: 'amount',
								maxWidth: 100
							}
						]}
						data={distribution.data}
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
		distribution: state.distribution,
		transactions: state.transactions,
		auth: state.auth
	};
}

export default connect(mapStateToProps, actions)(Distributions);
