import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { Link } from 'react-router-dom';
import 'react-table/react-table.css';
import * as actions from '../../actions';

class InvestorTransactions extends Component {
	filterCaseInsensitive(filter, row) {
		const id = filter.pivotId || filter.id;
		return row[id] !== undefined
			? String(row[id].toLowerCase()).includes(filter.value.toLowerCase())
			: true;
	}

	render() {
		return (
			<div className="section">
				<h5>Investments</h5>
				<ReactTable
					columns={[
						{
							Header: 'ICO name',
							accessor: 'name',
							width: 200
						},
						{
							Header: 'ICO status',
							accessor: 'status',
							maxWidth: 100
						},
						{
							Header: 'ETH invested',
							accessor: 'totals.ETH',
							maxWidth: 100
						},
						{
							Header: 'BTC invested',
							accessor: 'totals.BTC',
							width: 100
						},
						{
							Header: 'USD invested',
							accessor: 'totals.USD',
							width: 100
						},
						{
							Header: 'Tokens allocation',
							id: 'tokensAllocated',
							width: 200,
							accessor: d =>
								d.tokensAllocated ? Math.round(d.tokensAllocated.amount) : 0
						},
						{
							Header: 'Transactions',
							width: 100,
							id: 'transactionsLinks',
							accessor: d => (
								<Link to={`/transactions/${this.props._id}/${d._id}`}>
									<i className="tine material-icons">attach_money</i>
								</Link>
							)
						}
					]}
					data={this.props.investorTransactions}
					defaultPageSize={5}
					className="-striped -highlight"
				/>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		investorTransactions: state.investorTransactions
	};
}

export default connect(mapStateToProps, actions)(InvestorTransactions);
