import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { Link } from 'react-router-dom';
import 'react-table/react-table.css';
import * as actions from '../../actions';

class InvestorTokens extends Component {
	filterCaseInsensitive(filter, row) {
		const id = filter.pivotId || filter.id;
		return row[id] !== undefined
			? String(row[id].toLowerCase()).includes(filter.value.toLowerCase())
			: true;
	}

	render() {
		return (
			<div className="section">
				<h5>Tokens</h5>
				<ReactTable
					columns={[
						{
							Header: 'ICO name',
							accessor: 'ico.name',
							width: 200
						},
						{
							Header: 'ICO symbol',
							accessor: 'ico.symbol',
							maxWidth: 100
						},
						{
							Header: 'ICO distribution',
							accessor: 'distribution',
							maxWidth: 150
						},
						{
							Header: 'Tokens withdrawn',
							accessor: 'withdrawn',
							width: 150
						},
						{
							Header: 'Tokens locked',
							accessor: 'locked',
							width: 150
						},
						{
							Header: 'Tokens available',
							id: 'available',
							width: 150,
							accessor: 'available'
						},
						{
							Header: 'Withdrawals',
							width: 100,
							id: 'withdrawalsLinks',
							accessor: d => (
								<Link to={`/withdrawals/${d.ico._id}/${this.props._id}`}>
									<i className="tine material-icons">attach_money</i>
								</Link>
							)
						}
					]}
					data={this.props.investorTokens}
					defaultPageSize={5}
					className="-striped -highlight"
				/>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		investorTokens: state.investorTokens
	};
}

export default connect(mapStateToProps, actions)(InvestorTokens);
