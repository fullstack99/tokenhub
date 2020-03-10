import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { Link } from 'react-router-dom';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import moment from 'moment';
import {
	Button, Glyphicon
} from 'react-bootstrap';
import _ from 'lodash';

import LoadingBar from '../loadingBar/LoadingBar';

import * as actions from '../../actions/adminLogs';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import './AdminLog.css';

class AdminLog extends Component {

	constructor(props) {
		super(props);

		this.state = {
			ranges: {
				'Today': [moment(), moment()],
				'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
				'Last 7 Days': [moment().subtract(6, 'days'), moment()],
				'Last 30 Days': [moment().subtract(29, 'days'), moment()],
				'This Month': [moment().startOf('month'), moment().endOf('month')],
				'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
			},
			startDate: undefined,
			endDate: undefined,
			data: [],
			pages: 1000000,
			loading: true,
			page: 0,
			pageSize: 20,
			sorted: [],
			filtered: [],
			length: 0
		};
	}

	componentWillMount() {
		const sendData = {
			pageSize: 20,
			page: 0,
			sorted: [],
			filtered: []
		}
		this.props.fetchAllAdminLogs(sendData);
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.adminLog.isFetched) {
			this.setState({ 
				data: nextProps.adminLog.data,
				length: nextProps.adminLog.length
			});
			if(!_.isNil(nextProps.auth._ico)) {
				let temp =[];
				nextProps.adminLog.data.map(log => {
					if(log.user._ico == nextProps.auth._ico) {
						temp.push(log);
					}
				});
				this.setState({ 
					data: temp,
					length: temp.length
				})
			}
		}
	}

	onRefresh() {
		const sendData = {
			pageSize: 20,
			page: 0,
			sorted: [{ id: 'created_at', desc: false }],
			filtered: []
		}
		this.props.fetchAllAdminLogs(sendData);

	}
	requestData = (pageSize, page, sorted, filtered) => {
		const sendData = {
			pageSize: pageSize,
			page: page,
			sorted: sorted,
			filtered: filtered
		}
		this.props.fetchAllAdminLogs(sendData);

		const { data, length } = this.state

		return new Promise((resolve, reject) => {
			let filteredData = data;
			const res = {
				rows: filteredData.slice(pageSize * page, pageSize * page + pageSize),
				pages: Math.ceil(length / pageSize)
			};
			setTimeout(() => resolve(res), 500);
		});
	};

	fetchData = _.debounce((state) => {
		this.setState({ loading: true });
		this.setState({
			pageSize: state.pageSize,
			page: parseInt(state.page),
			sorted: state.sorted,
			filtered: state.filtered
		})
		this.requestData(
			state.pageSize,
			state.page,
			state.sorted,
			state.filtered
		).then(res => {
			this.setState({
				loading: false,
				pages: res.pages
			});
		});
	}, 500);

	showPrePage() {
		const { page, pageSize, sorted, filtered } = this.state
		const state = {
			pageSize: pageSize,
			page: page -1,
			sorted: sorted,
			filtered: filtered
		}
		this.fetchData(state)
	}

	showNextPage() {
		const { page, pageSize, sorted, filtered } = this.state
		const state = {
			pageSize: pageSize,
			page: page + 1,
			sorted: sorted,
			filtered: filtered
		}
		this.fetchData(state)
	}

	pageSize(e) {
		console.log(e.target.value)
		this.setState({page: parseInt(e.target.value)})
		const { page, pageSize, sorted, filtered } = this.state
		const state = {
			pageSize: pageSize,
			page: parseInt(e.target.value),
			sorted: sorted,
			filtered: filtered
		}
		this.fetchData(state)
	}

	render() {
		const { adminLog, auth } = this.props;
		const { startDate, endDate, pages, data, loading, page } = this.state;
		let label = '';
		let start = startDate && startDate.format('YYYY-MM-DD') || '';
		let end = endDate && endDate.format('YYYY-MM-DD') || '';

		label = start + ' - ' + end;
		let locale = {
			format: 'YYYY-MM-DD',
			cancelLabel: 'Clear',
		};

		if (start === end) {
			label = start;
		}

		if (adminLog.isFetched) {
			return (
				<div className="admin-log-section">
					<ReactTable
						columns={[
							{
								Header: 'Investor',
								id: 'user.email',
								accessor: d => d.user ? d.user.email : ""
							},

							{
								Header: 'IP',
								accessor: 'ip',
								maxWidth: 200
							},
							{
								Header: 'Created_At',
								id: 'created_at',
								maxWidth: 200,
								accessor: d => moment(d.created_at).format('MM/DD/YYYY HH:mm'),
								filterMethod: (filter, row) => {
									if (filter.value.startDate === undefined) {
										return true;
									} else {
										let startDate = moment(filter.value.startDate).format('YYYY-MM-DD');
										let rowDate = moment(row[filter.id]).format('YYYY-MM-DD');
										let endDate = moment(filter.value.endDate).format('YYYY-MM-DD');
										return rowDate >= startDate && rowDate <= endDate;
									}
								},
								Filter: ({ filter, onChange }) => (
									<DateRangePicker
										ocale={locale}
										onApply={
											(event, picker) => {
												this.setState({
													startDate: picker.startDate,
													endDate: picker.endDate
												});
												let pickerProps = {
													startDate: picker.startDate,
													endDate: picker.endDate,
												};
												onChange(pickerProps);
											}
										}
										onCancel={
											(event, picker) => {
												this.setState({
													startDate: undefined,
													endDate: undefined
												});
												let pickerProps = {
													startDate: undefined,
													endDate: undefined,
												};
												onChange(pickerProps);
											}
										}
										ranges={this.state.ranges}
									>
										<div className="input-group">
											<input type="text" className="form-control date-input" value={label} readOnly />
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
								Header: 'Path',
								accessor: 'path'
							}
						]}
						data={data}
						pages={pages}
						loading={loading}
						onFetchData={(state) => this.fetchData(state)}
						filterable
						defaultPageSize={20}
						className="-striped -highlight"
					/>
					<div className="btn-group">
						<button className="btn btn-defualt" type="button" onClick={() => this.showPrePage()} disabled={page == 0}>Previous</button>
						<div className="page-num-section">
							<label>Page</label><input type="number" className="pageSize" value={page+1} onChange={this.pageSize.bind(this)} />
							<label> of {pages}</label>
						</div>
						<button className="btn btn-defualt" type="button" onClick={() => this.showNextPage()}>Next</button>
					</div>
					<div
						className="fixed-action-btn"
						style={{ bottom: '45px', right: '24px' }}
					>
						<a className="btn-floating btn-large waves-effect waves-light red" onClick={this.onRefresh.bind(this)}>
							<i className="material-icons">refresh</i>
						</a>
					</div>

				</div>
			)
		} else {
			return (
				<LoadingBar type="spinner" />
			)
		}
	}
};

function mapStateToProps(state) {
	return {
		adminLog: state.adminLog,
		auth: state.auth
	};
}

export default connect(mapStateToProps, actions)(AdminLog);
