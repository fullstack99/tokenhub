import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import LoadingBar from '../loadingBar/LoadingBar';

import * as actions from '../../actions/icos';

// import './IcoList.css';

class ViewIcoClosed extends Component {
	constructor(props) {
		super(props);

		this.state = {
			data: []
		};
		this.renderEditable = this.renderEditable.bind(this);
	}
	
	componentDidMount() {
		const { icos, investors } = this.props;
		this.setState({ data: icos.closedIco });
	}

	filterCaseInsensitive(filter, row) {
		const id = filter.pivotId || filter.id;
		if (id == 'ico') {
			return !_.isNil(id)
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

	icoCloseConfirm() {
		const { icos, history } = this.props;
		const { data } = this.state;

		this.props.fetchIcoClosedConfirm(data, () => {
			history.push('/icos');
		});
	}

	renderEditable(cellInfo) {
		if (this.state.data.length > 0) {
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
					dangerouslySetInnerHTML={{
						__html: this.state.data[cellInfo.index][cellInfo.column.id]
					}}
				/>
			);
		} else {
			return <LoadingBar type="spinner" />;
		}
	}

	render() {
		const { icos } = this.props;
		if (icos.closedIco.length > 0) {
			return (
				<div className="row ico-closed">
					<div className="col-sm-12">
						<button
							type="button"
							className="btn btn-primary"
							onClick={() => this.icoCloseConfirm()}
						>
							Confirm
						</button>
					</div>
					<div className="col-sm-12">
						<ReactTable
							columns={[
								{
									Header: 'Investor',
									id: 'investor',
									accessor: d => (d.investor ? d.email : '')
								},

								{
									Header: 'ICO',
									id: 'ico',
									accessor: d => {
										const findIco = _.find(icos.data, { _id: d.ico });
										return <div>{findIco.name}</div>;
									}
								},
								{
									Header: 'Amount',
									accessor: 'amount',
									Cell: this.renderEditable
								},
								{
									Header: 'Type',
									accessor: 'type'
								}
							]}
							data={icos.closedIco}
							filterable
							defaultPageSize={20}
							defaultFilterMethod={this.filterCaseInsensitive}
							className="-striped -highlight"
						/>
					</div>
					<div className="col-sm-12">
						<button
							type="button"
							className="btn btn-primary"
							onClick={() => this.icoCloseConfirm()}
						>
							Confirm
						</button>
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
		icos: state.icos,
		investors: state.investors
	};
}

export default connect(mapStateToProps, actions)(ViewIcoClosed);
