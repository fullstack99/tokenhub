import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import * as actions from '../actions';

class Payments extends Component {
	render() {
		const { auth } = this.props;
		if(!_.isNil(auth._ico)) {
			return [
				<li key="transactionDrop">
					<a className="dropdown-button" href="#!" data-activates="transactions1">
						Transactions<i className="material-icons right">arrow_drop_down</i>
					</a>
				</li>,
				<li key="icos">
					<Link to="/icos">ICO's</Link>
				</li>,
				<li key="adminDrop">
					<a className="dropdown-button" href="#!" data-activates="adminTools">
						Admin<i className="material-icons right">arrow_drop_down</i>
					</a>
				</li>
			];
		} else {
			return [
				<li key="transactionDrop">
					<a className="dropdown-button" href="#!" data-activates="transactions1">
						Transactions<i className="material-icons right">arrow_drop_down</i>
					</a>
				</li>,	
				<li key="reportsDrop"> 
					<a className="dropdown-button" href="#!" data-activates="reports">
						Reports<i className="material-icons right">arrow_drop_down</i>
					</a>
					{/* <Link to="/reports">Reports</Link> */}
				</li>,
				<li key="icos">
					<Link to="/icos">ICO's</Link>
				</li>,
				<li key="adminDrop">
					<a className="dropdown-button" href="#!" data-activates="adminTools">
						Admin<i className="material-icons right">arrow_drop_down</i>
					</a>
				</li>
			];
		}
		
	}
}
//tests and more
function mapStateToProps(state) {
	return {
		auth: state.auth
	};
}

export default connect(mapStateToProps, actions)(Payments);
