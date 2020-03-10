import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { Link } from 'react-router-dom';
import 'react-table/react-table.css';
import * as actions from '../../actions';

class InvestorsDocuments extends Component {
	filterCaseInsensitive(filter, row) {
		const id = filter.pivotId || filter.id;
		return row[id] !== undefined
			? String(row[id].toLowerCase()).includes(filter.value.toLowerCase())
			: true;
	}

	render() {
		return (
			<div className="section">
				<h5>Documents</h5>
				<ReactTable
					columns={[
						{
							Header: 'Title',
							accessor: 'title',
							width: 200
						},
						{
							Header: 'Country',
							accessor: 'country',
							maxWidth: 200
						},
						{
							Header: 'Documents',
							width: 200,
							id: 'link',
							accessor: d => (
								<Link to={d.link} target="_blank" >
									<i className="tine material-icons">archive</i>
								</Link>
							)
						}
					]}
					data={this.props.investorsDocuments}
					defaultPageSize={5}
					className="-striped -highlight"
				/>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		investorsDocuments: state.investorDocuments
	};
}

export default connect(mapStateToProps, actions)(InvestorsDocuments);
