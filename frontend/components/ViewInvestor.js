import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import * as actions from '../actions';

import InvestorTransactions from './investors/InvestorsTransactions';
import InvestorTokens from './investors/InvestorsTokens';
import InvestorDocuments from './investors/InvestorsDocuments';
import LoadingBar from './loadingBar/LoadingBar';

class Investor extends Component {
	componentWillMount() {
		this.props.fetchInvestorById(this.props.match.params.investorId);
		this.props.fetchInvestorTransactions(this.props.match.params.investorId);
		this.props.fetchInvestorTokens(this.props.match.params.investorId);
		this.props.fetchInvestorDocuments(this.props.match.params.investorId);
	}

	onMfaChange(e) {
		this.props.switchMfa(this.props.investor._id, e.target.checked);
	}

	onAmlChange(e) {
		this.props.switchAml(this.props.investor._id, e.target.checked);
	}

	onKycChange(e) {
		this.props.switchKyc(this.props.investor._id, e.target.checked);
	}

	onAccreditationChange(e) {
		this.props.switchAccreditation(this.props.investor._id, e.target.checked);
	}

	accreditation(accreditation) {
		return (
			<div className="section">
				<h5>Accreditation</h5>
				<table className="striped">
					<thead>
						<tr>
							<th>Accreditation status</th>
							<th>ncAccount</th>
							<th>accreditation date</th>
							<th>Documents</th>
						</tr>
					</thead>
					<tbody>
						{accreditation.length > 1
							?
							accreditation.map((item, index) => (
								<tr key={index}>

									<td>{item.ncAccreditation_status}</td>
									<td>{item.ncAccount}</td>
									<td>
										{item.accreditation_date
											? moment.utc(item.accreditation_date).format('LLL')
											: ' - '}
									</td>
									<td>
										{index === accreditation.length - 1 ?
											<a
												href={`${
													process.env.REACT_APP_CLIENT_HOST
													}/admin/api/getAccreditationDocuments/${
													this.props.investor._id
													}/${this.props.auth.token}`}
												target="_blank"
											>
												<i className="tine material-icons">archive</i>
											</a>
											:
											<div></div>
										}
									</td>
								</tr>
							))
							:
							<tr >
								<td>{accreditation.ncAccreditation_status}</td>
								<td>{accreditation.ncAccount}</td>
								<td>
									{accreditation.accreditation_date
										? moment.utc(accreditation.accreditation_date).format('LLL')
										: ' - '}
								</td>
								<td>

									<a
										href={`${
											process.env.REACT_APP_CLIENT_HOST
											}/admin/api/getAccreditationDocuments/${
											this.props.investor._id
											}/${this.props.auth.token}`}
										target="_blank"
									>
										<i className="tine material-icons">archive</i>
									</a>

								</td>
							</tr>

						}

					</tbody>
				</table>
			</div>
		);
	}

	render() {
		//console.log(process.env);
		if (this.props.investor._id) {
			const { investor } = this.props;
			//this.setState({ mfaChecked: investor.mfa.enrolled });
			//console.log(investor);
			return (
				<div>
					<div className="section">
						<h5>Investor info</h5>
						<table className="striped">
							<tbody>
								<tr>
									<td>
										<b>Investor ID</b>
									</td>
									<td>{investor._id}</td>
								</tr>
								<tr>
									<td>
										<b>Status</b>
									</td>
									<td>{investor.status}</td>
								</tr>
								<tr>
									<td>
										<b>E-mail</b>
									</td>
									<td>{investor.email}</td>
								</tr>
								<tr>
									<td>
										<b>Type</b>
									</td>
									<td>{investor.investAs}</td>
								</tr>
								<tr>
									<td>
										<b>Country</b>
									</td>
									<td>{investor.country}</td>
								</tr>
								<tr>
									<td>
										<b>First Name</b>
									</td>
									<td>{investor.firstName}</td>
								</tr>
								<tr>
									<td>
										<b>Last Name</b>
									</td>
									<td>{investor.lastName}</td>
								</tr>
								<tr>
									<td>
										<b>Entity name</b>
									</td>
									<td>{investor.entityName}</td>
								</tr>
								<tr>
									<td>
										<b>DOB</b>
									</td>
									<td>{moment.utc(investor.dob).format('L')}</td>
								</tr>
								<tr>
									<td>
										<b>Phone</b>
									</td>
									<td>{investor.phone}</td>
								</tr>
								<tr>
									<td>
										<b>Address1</b>
									</td>
									<td>{investor.address1}</td>
								</tr>
								<tr>
									<td>
										<b>Address2</b>
									</td>
									<td>{investor.address2}</td>
								</tr>
								<tr>
									<td>
										<b>City</b>
									</td>
									<td>{investor.city}</td>
								</tr>
								<tr>
									<td>
										<b>ZIP</b>
									</td>
									<td>{investor.zip}</td>
								</tr>
								<tr>
									<td>
										<b>Default ICO</b>
									</td>
									<td>{investor.defaultIco}</td>
								</tr>
								<tr>
									<td>
										<b>Registration date</b>
									</td>
									<td>{moment.utc(investor.created_at).format('LLL')}</td>
								</tr>
								<tr>
									<td>
										<b>2fa</b>
									</td>
									<td>
										<div className="switch">
											<label>
												Disable
												<input
													type="checkbox"
													checked={investor.mfa.enrolled}
													onChange={this.onMfaChange.bind(this)}
												/>
												<span className="lever" />
												Enable
											</label>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div className="divider" />
					<div className="section">
						<h5>AML/KYC</h5>
						<table className="striped">
							<thead>
								<tr>
									<th>Profile type</th>
									<th>API status</th>
									<th>API status date</th>
									<th>Override flag</th>
									<th>Final status</th>
									<th>Documents</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>
										<b>AML</b>
									</td>
									<td>{investor.verification.idmAml_status}</td>
									<td>
										{moment.utc(investor.verification.Aml_date).format('LLL')}
									</td>
									<td>
										<div className="switch">
											<label>
												Off
												<input
													type="checkbox"
													checked={investor.verification.amlOverride}
													onChange={this.onAmlChange.bind(this)}
												/>
												<span className="lever" />
												On
											</label>
										</div>
									</td>
									<td>
										{investor.verification.amlOverride ||
											investor.verification.idmAml
											? 'Verified'
											: investor.verification.idmAml_status}
									</td>
									<td />
								</tr>
								<tr>
									<td>
										<b>KYC</b>
									</td>
									<td>{investor.verification.idmKyc_status}</td>
									<td>
										{moment.utc(investor.verification.Kyc_date).format('LLL')}
									</td>
									<td>
										<div className="switch">
											<label>
												Off
												<input
													type="checkbox"
													checked={investor.verification.kycOverride}
													onChange={this.onKycChange.bind(this)}
												/>
												<span className="lever" />
												On
											</label>
										</div>
									</td>
									<td>
										{investor.verification.kycOverride ||
											investor.verification.idmKyc
											? 'Verified'
											: investor.verification.idmKyc_status}
									</td>
									<td>
										<a
											href={`${
												process.env.REACT_APP_CLIENT_HOST
												}/admin/api/getDocuments/${investor._id}/${
												this.props.auth.token
												}`}
											target="_blank"
										>
											<i className="tine material-icons">archive</i>
										</a>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div className="divider" />
					{investor.country === 'US'
						? this.accreditation(investor.accreditation)
						: ''}
					<div className="divider" />
					<InvestorTransactions {...this.props.investor} />
					<div className="divider" />
					<InvestorTokens {...this.props.investor} />
					<div className="divider" />
					<InvestorDocuments {...this.props.investor} />
					
				</div>
			);
		}
		else return <LoadingBar type="spinner" />;
	}
}

function mapStateToProps(state) {
	//this.setState({ mfaChecked: state.investor.mfa.enrolled });
	//console.log(state);
	return {
		investor: state.investor,
		auth: state.auth
	};
}

export default connect(mapStateToProps, actions)(Investor);
