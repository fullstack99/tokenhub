import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { Link, withRouter } from 'react-router-dom';
import _ from 'lodash';

import LoadingBar from '../loadingBar/LoadingBar';
import IcoForm from './IcoForm';

import * as actions from '../../actions/icos';

import './IcoList.css';

const ReactToastr = require('react-toastr');
const { ToastContainer } = ReactToastr;
const ToastMessageFactory = React.createFactory(
	ReactToastr.ToastMessage.animation
);

class IcosAllList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			addIco: false
		};
		this.onAddIco = this.onAddIco.bind(this);
		this.viewIcoForm = this.viewIcoForm.bind(this);
		this.viewList = this.viewList.bind(this);
	}

	onAddIco(data) {
		this.props.fetchIcoAdd(data)		
	}
	viewIcoForm() {
		this.setState({ addIco: true });
	}
	viewList() {
		this.setState({ addIco: false });
	}
	componentWillMount() {
		this.props.fetchAllIcos();
	}

	componentWillReceiveProps = (nextProps) => {
		if (nextProps.icos.closeConfirmFlag || nextProps.icos.isUpdated === true) {
			this.refs.message.success(
				"",
				"Update Success", {
					timeOut: 2000,
					extendedTimeOut: 2000
				});
			this.props.fetchRequest();
		} else if (nextProps.icos.closeConfirmFlag === false || nextProps.icos.isUpdated === false) {
			this.refs.message.error(
				"",
				"Update Fail", {
					timeOut: 2000,
					extendedTimeOut: 2000
				});
			this.props.fetchRequest();
		}

		if (nextProps.icos.isAdded === true) {
			this.refs.message.success(
				"",
				"New ICO Added Success", {
					timeOut: 2000,
					extendedTimeOut: 2000
				});
			this.setState({ addIco: false });
			this.props.fetchRequest();
			this.props.fetchAllIcos();			
		} else if (nextProps.icos.isAdded === false) {
			this.refs.message.error(
				"",
				"New ICO Added Fail", {
					timeOut: 2000,
					extendedTimeOut: 2000
				});
			this.props.fetchRequest();
		}
	};

	icoClosed(id) {
		const history = this.props.history;
		this.props.fetchIcoClosed(id, () => {
			history.push(`icos/${id}/close`);
		});
	}

	onRefresh() {
		this.props.fetchAllIcos();
	}
	render() {
		const { icos, auth, history } = this.props;
		const { addIco } = this.state;
		if (icos.isFetched) {
			if(!_.isNil(auth._ico)) {
				history.push(`icos/${auth._ico}`);
				return null;
			} else {
				return (
					<div>
						<ToastContainer
							ref="message"
							toastMessageFactory={ToastMessageFactory}
							className="toast-top-right"
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
						{addIco ? (
							<div>
								<a
									className="btn-floating btn-large waves-effect waves-light red"
									onClick={this.viewList}
								>
									<i className="material-icons">list</i>
								</a>
								<h4>New Ico</h4>
								<IcoForm
									icoAdd={true}
									onSubmit={this.onAddIco}
									initialValues={{}}
								/>
							</div>
						) : (
								<div>
									<a
										className="btn-floating btn-large waves-effect waves-light red"
										onClick={this.viewIcoForm}
									>
										<i className="material-icons">add</i>
									</a>
									<ReactTable
										columns={[
											{
												Header: 'Name',
												id: 'name',
												accessor: d => <Link to={'/icos/' + d._id}>{d.name}</Link>,
												maxWidth: 150
											},

											{
												Header: 'Symbol',
												accessor: 'symbol',
												maxWidth: 150
											},
											{
												Header: 'Logo',
												id: 'logo',
												filterable: false,
												accessor: d => {
													return (
														<div className="center">
															<img className="logo-img" src={d.logo} />
														</div>
													);
												}
											},
											{
												Header: 'Status',
												accessor: 'status',
												maxWidth: 120,
												id: 'status',
												filterMethod: (filter, row) => {
													if (filter.value === 'all') {
														return true;
													}
													if (filter.value === 'active') {
														return row[filter.id] === 'active';
													}
													if (filter.value === 'pending') {
														return row[filter.id] === 'pending';
													}
													if (filter.value === 'closed') {
														return row[filter.id] === 'closed';
													}
												},
												Filter: ({ filter, onChange }) => (
													<select
														onChange={event => onChange(event.target.value)}
														style={{ width: '100%', display: 'block' }}
														value={filter ? filter.value : 'all'}
													>
														<option value="all">Show All</option>
														<option value="active">Active</option>
														<option value="pending">Pending</option>
														<option value="closed">Closed</option>
													</select>
												)
											},
											{
												Header: 'Action',
												id: 'action',
												accessor: d => {
													if (d.status != 'closed') {
														return (
															<button
																type="button"
																className="btn btn-default"
																onClick={() => this.icoClosed(d._id)}
															>Close</button>
														)
													}
												},
												filterable: false,
												style: {
													textAlign: 'center'
												}
											}
										]}
										data={icos.data}
										filterable
										// defaultFilterMethod={this.filterCaseInsensitive}
										defaultPageSize={20}
										className="-striped -highlight"
									/>
								</div>
							)}
					</div>
				);
			}
		} else {
			return <LoadingBar type="spinner" />;
		}
	}
}

function mapStateToProps(state) {
	return {
		icos: state.icos,
		auth: state.auth
	};
}

export default withRouter(connect(mapStateToProps, actions)(IcosAllList));
