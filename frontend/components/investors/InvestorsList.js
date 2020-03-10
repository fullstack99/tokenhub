import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { Link } from 'react-router-dom';
import 'react-table/react-table.css';
import * as actions from '../../actions';
import { CSVLink, CSVDownload } from 'react-csv';
import LoadingBar from '../loadingBar/LoadingBar';

class InvestorsList extends Component {
	constructor(props) {
		super(props)
		this.csvDataCreate = this.csvDataCreate.bind(this);
		this.tempData = [];
		this.state = {
			Headers: [
				{ label: 'E-mail', key: 'email_value' },
				{ label: 'Type', key: 'investAs' },
				{ label: 'Country', key: 'country' },
				{ label: 'Name', key: 'fullName' },
				{ label: 'AML status', key: 'verification.idmAml_status' },
				{ label: 'AML override', key: 'amlOverride' },
				{ label: 'KYC status', key: 'verification.idmKyc_status' },
				{ label: 'KYC override', key: 'kycOverride' },
				{ label: 'Registration date', key: 'created_at' },
				{ label: 'Default ICO', key: 'defaultIco' },
			],
			csvData: []
		}
	}
	componentWillMount() {
		this.props.fetchInvestors();
	}
	onRefresh() {
		this.props.fetchInvestors();

	}
	filterCaseInsensitive(filter, row) {
		const id = filter.pivotId || filter.id;
		if (id === 'email') {
			return row[id] !== undefined
				? String(row[id].props.children.toLowerCase()).includes(
					filter.value.toLowerCase()
				)
				: true;
		} else {
			return row[id] !== undefined
				? String(row[id].toLowerCase()).includes(filter.value.toLowerCase())
				: true;
		}
	}
	csvDataCreate() {
		this.setState({ csvData: this.tempData });
	}

	render() {
		let { csvData, Headers } = this.state;
		if (this.props.investors.length > 0) {
			return (
				<div>
					<div onClick={this.csvDataCreate}>
						<CSVLink data={csvData} headers={Headers} filename="investors.csv">
							<i className="tine material-icons">archive</i>
						</CSVLink>
					</div>
					<ReactTable
						columns={[
							{
								Header: 'Tools',
								id: 'tools',
								maxWidth: 70,
								filterable: false,
								accessor: d => {
									return (
										<div>
											<a
												href={`${
													process.env.REACT_APP_CLIENT_HOST
													}/admin/api/loginUnder/${d._id}/${
													this.props.auth.token
													}`}
												target="_blank"
											>
												<i className="tine material-icons">account_box</i>
											</a>
											<a
												href={`${
													process.env.REACT_APP_CLIENT_HOST
													}/admin/api/getDocuments/${d._id}/${
													this.props.auth.token
													}`}
												target="_blank"
											>
												<i className="tine material-icons">archive</i>
											</a>
										</div>
									);
								}
							},
							{
								Header: 'E-mail',
								id: 'email',
								width: 300,
								accessor: d => <Link to={'/investors/' + d._id}>{d.email}</Link>
							},
							{
								Header: 'Type',
								accessor: 'investAs',
								maxWidth: 100
							},
							{
								Header: 'Country',
								accessor: 'country',
								maxWidth: 70
							},
							{
								Header: 'Name',
								id: 'fullName',
								width: 200,
								accessor: d => d.firstName + ' ' + d.lastName
							},
							{
								Header: 'AML status',
								accessor: 'verification.idmAml_status'
							},
							{
								Header: 'AML override',
								id: 'amlOverride',
								accessor: d => (d.verification.amlOverride ? 'YES' : '')
							},
							{
								Header: 'KYC status',
								accessor: 'verification.idmKyc_status'
							},
							{
								Header: 'KYC override',
								id: 'kycOverride',
								accessor: d => (d.verification.kycOverride ? 'YES' : '')
							},
							{
								Header: 'Registration date',
								accessor: 'created_at'
							},
							{
								Header: 'Default ICO',
								accessor: 'defaultIco'
							}
						]}
						data={this.props.investors}
						filterable
						defaultFilterMethod={this.filterCaseInsensitive}
						defaultPageSize={20}
						className="-striped -highlight"
						getTbodyProps={(state, rowInfo, column) => {
							this.tempData = Object.assign([], state.sortedData);
							this.tempData.map(item => {
								if (item.email)
									item.email_value = item.email.props.children;
							})
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
		investors: state.investors,
		auth: state.auth
	};
}

export default connect(mapStateToProps, actions)(InvestorsList);
