import React, { Component } from 'react';
import { Router, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';

import Header from './Header';
import Landing from './Landing';
import Investors from './Investors';
import Transactions from './Transactions';
import ViewInvestor from './ViewInvestor';
import Icos from './Icos';
import ViewIco from './ViewIco';
import ViewIcoClosed from './icos/ViewIcoClosed';
import XRate from './XRates';
import MassUploadTransactions from './MassUploadTransactions';
import AdminLog from './adminLog/AdminLog';
import Withdrawals from './withdrawals/Withdrawal';
import Distributions from './distributions/Distribution';
import MassUploadWithdrawals from './MassUploadWithdrawals';
import Reports from './Reports';
let self;

const PrivateRoute = ({ component: Component, ...rest, props }) => {
	const { auth } = props;

	return (
		<Route exact
			{...rest}
			render={(props) => auth === false
				? <Redirect to={{ pathname: '/', state: { from: props.location } }} />
				: <Component {...props} />}

		/>
	)
}

class App extends Component {

	constructor(props) {
		super(props);
		self = this;
	}

	componentDidMount() {
		this.props.fetchUser();
		window.addEventListener('mousedown', this.pageClick, false);

	}

	pageClick(e) {
		// check user
		self.props.fetchUser();
	}

	render() {
		return (
			<div>
				<Router history={this.props.history}>
					<div className="container">
						<Header />
						<Route exact path="/" component={Landing} />
						<PrivateRoute path="/transactions" component={Transactions} props={this.props} />
						<PrivateRoute path="/transactions/:investorId/:icoId" component={Transactions} props={this.props} />
						<PrivateRoute path="/investors" component={Investors} props={this.props} />
						<PrivateRoute path="/xrates" component={XRate} props={this.props} />
						<PrivateRoute path="/investors/:investorId" component={ViewInvestor} props={this.props} />
						<PrivateRoute path="/icos" component={Icos} props={this.props} />
						<PrivateRoute path="/icos/:icoId" component={ViewIco} props={this.props} />
						<PrivateRoute path="/icos/:icoId/close" component={ViewIcoClosed} props={this.props} />
						<PrivateRoute path="/adminLogs" component={AdminLog} props={this.props} />
						<PrivateRoute path="/importTransactions" component={MassUploadTransactions} props={this.props} />
						<PrivateRoute path="/withdrawals" component={Withdrawals} props={this.props} />
						<PrivateRoute path="/withdrawals/:icoId/:investorId" component={Withdrawals} props={this.props} />
						<PrivateRoute path="/importWithdrawals" component={MassUploadWithdrawals} props={this.props} />
						<PrivateRoute path="/distributions" component={Distributions} props={this.props} />
						<PrivateRoute path="/reports" component={Reports} props={this.props} />
						<PrivateRoute path="/reports/:listType" component={Reports} props={this.props} />

					</div>
				</Router>
			</div>
		);
	}
}


function mapStateToProps(state) {
	return {
		auth: state.auth
	};
}
export default connect(mapStateToProps, actions)(App);
