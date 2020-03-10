import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import ReactTable from 'react-table';

import LoadingBar from '../loadingBar/LoadingBar';
import FilterXRate from './FilterXRate';

import * as actions from '../../actions/xRates';

import 'react-table/react-table.css'
import './XRateList.css'

const ReactToastr = require("react-toastr");
const { ToastContainer } = ReactToastr;
const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);

class XRatesList extends Component {
	
	constructor(props) {
        super(props);

		this.state = {
			isOpen: false,
			selectedXRate: {}
		}
    }

	componentWillMount () {
		this.props.fetchAllXRates();		
	}

	componentWillReceiveProps = (nextProps) => {
	  	if(nextProps.xRates.updatedFlag) {
			this.refs.message.success(
			"",
			"Update Success", {
				timeOut: 2000,
				extendedTimeOut: 2000
			});
			this.props.fetchARequest();
		} else if (nextProps.xRates.updatedFlag === false) {
			this.refs.message.error(
			"",
			"Update Fail", {
				timeOut: 2000,
				extendedTimeOut: 2000
			});
			this.props.fetchARequest();
		}
	}
	
	
	// show and hide modal
	toggleModal = (data) => {
		this.setState({
			isOpen: !this.state.isOpen
		});
		this.setState({ selectedXRate: data });
	}

	render() {
		const { xRates, selectedIco } = this.props
	
		if(xRates.isFetching) {
			return (
				<LoadingBar type="spinner"/>
			)
		} else {
			return (
				<div>
					
					<ToastContainer ref="message"
						toastMessageFactory={ToastMessageFactory}
						className="toast-top-right" />
					{
						this.state.isOpen && 
						<div className="overlay-section">
							<FilterXRate
								show={this.state.isOpen}
								onClose={this.toggleModal}
								selectedXRate={this.state.selectedXRate}
								selectedICO={selectedIco}
							>
							</FilterXRate>
						</div>
					}					
					<ReactTable
						data={xRates.data}
						columns={[
							{
								Header: 'Date',
								id: 'date',
								accessor: d => d.date.substring(0, 10)
							//	maxWidth: 150
							},
							{
								Header: 'Currency',
								accessor: 'currency',
							//	width: 70
							},
							{
								Header: 'Rate',
								id: 'rate',
								accessor: d => d.rate.toFixed(2)
							//	maxWidth: 100
							},
							{
								Header: 'Action',
								id: 'action',
								accessor: d => (
									<i className="tine material-icons" onClick={() => this.toggleModal(d)}>cached</i>
								),
								filterable:false,
								style: {
									textAlign: 'center'
								}
							}
						]}						
						filterable
						defaultPageSize={20}
						className="-striped -highlight"
						
					/>
				</div>
			);
		}		
	}
}

function mapStateToProps(state) {
	return {
		xRates: state.xRates
	};
}

export default connect(mapStateToProps, actions)(XRatesList);
