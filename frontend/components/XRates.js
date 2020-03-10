import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import XRatesList from './xRates/XRateList';
import IcosList from './icos/IcosList';
import * as actions from '../actions';

class Dashboard extends Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedIco: ''
		};
		this.selectIco = this.selectIco.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.icos.data.length > 0) {
			if(!_.isNil(nextProps.auth._ico)) {
				this.setState({ selectedIco: nextProps.auth._ico });		
			} else
				this.setState({ selectedIco: nextProps.icos.data[0]._id });
		}
	}

	selectIco(val) {
		this.setState({ selectedIco: val });
	}
	onRefresh() {
		this.props.fetchAllIcos();
		this.props.fetchAllXRates();
	}
	render() {
		if (this.props.auth) {
			return (
				<div>
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
					<IcosList selectIco={this.selectIco} />
					<XRatesList selectedIco={this.state.selectedIco} />
					<div className="fixed-action-btn" />
				</div>
			);
		} else return null;
	}
}

function mapStateToProps(state) {
	return {
		auth: state.auth,
		icos: state.icos
	};
}

export default connect(mapStateToProps, actions)(Dashboard);
