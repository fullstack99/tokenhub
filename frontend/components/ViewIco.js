import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as actions from '../actions';

import IcoForm from './icos/IcoForm'
import LoadingBar from './loadingBar/LoadingBar';

class Ico extends Component {
	constructor(props) {
		super(props);
		this.SubmitResults = this.SubmitResults.bind(this);
	}
	componentWillMount() {
		this.props.fetchIcoById(this.props.match.params.icoId);
	}
	SubmitResults(data) {

		data.restrictedCountries = data.restrictedCountries.map(item => {
			if (typeof (item) === 'object') {
				return item.alpha2;
			} else {
				return item;
			}
		});

		this.props.fetchIcoUpdate(data, result => {
			if (result.success) {
				this.props.fetchIcoById(this.props.match.params.icoId);
				const history = this.props.history;
				history.push(`/icos`);
			}
		})
	}
	render() {
		const { ico } = this.props;
		if (ico._id && ico._id === this.props.match.params.icoId) {

			return (
				<div>
					<div className="section">
						<Link
							className="btn-floating btn-large waves-effect waves-light red"
							to="/icos"
						>
							<i className="material-icons">list</i>
						</Link>
						<table className="striped">
							<tbody>
								<tr>
									<td>
										<b>Ico ID</b>
									</td>
									<td>{ico._id}</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div className="divider" />
					<IcoForm onSubmit={this.SubmitResults} initialValues={ico} />
				</div>
			);
		}
		return <LoadingBar type="spinner" />;
	}
}

function mapStateToProps(state) {
	//this.setState({ mfaChecked: state.investor.mfa.enrolled });
	//console.log(state);
	return {
		ico: state.ico,
		auth: state.auth,
		icos: state.icos
	};
}

export default connect(mapStateToProps, actions)(Ico);
