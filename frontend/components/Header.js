import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as actions from '../actions';

import Menu from './Menu';

class Header extends Component {
	renderContent() {
		switch (this.props.auth) {
			case null:
				return;
			case false:
				return (
					<li>
						<a href="/auth">Login</a>
					</li>
				);
			default:
				return [
					<Menu key="menu" />,
					<li key="3">
						<a href="/api/logout">Log Out</a>
					</li>
				];
		}
	}

	render() {
		return [
			<ul id="transactions1" className="dropdown-content" key="transactions">
				<li>
					<Link to="/transactions">Investments</Link>
				</li>
				<li>
					<Link to="/withdrawals">Withdrawals</Link>
				</li>
				<li>
					<Link to="/distributions">Distributions</Link>
				</li>
				<li>
					<Link to="/xrates">X-rates</Link>
				</li>
			</ul>,
			<ul id="reports" className="dropdown-content" key="reports">
				<li>
					<Link to="/reports/investor">summary by investor</Link>
				</li>
				<li>
					<Link to="/reports/country">summary by country</Link>
				</li>
				<li>
					<Link to="/reports/balance">summary by balance</Link>
				</li>
				<li>
					<Link to="/reports/verification">summary by verification</Link>
				</li>
			</ul>,
			<ul id="adminTools" className="dropdown-content" key="adminTools">
				<li>
					<Link to="/importWithdrawals">Import withdrawals</Link>
				</li>
				<li>
					<Link to="/importTransactions">Import transactions</Link>
				</li>
				<li>
					<Link to="/adminLogs">Admin logs</Link>
				</li>
			</ul>,
			<nav key="navigation">
				<div className="nav-wrapper   light-blue darken-4">
					<Link
						to={this.props.auth ? '/investors' : '/'}
						className="brand-logo left"
					>
						TokenHub
					</Link>
					<ul className="right hide-on-med-and-down">{this.renderContent()}</ul>
				</div>
			</nav>
		];
	}
}

function mapStateToProps({ auth }) {
	return { auth };
}

export default connect(mapStateToProps, actions)(Header);
