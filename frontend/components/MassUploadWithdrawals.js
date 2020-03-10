import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/withdrawals';

import UploadForm from './withdrawals/uploadForm';
import { bindActionCreators } from 'redux';

class MassUploadWithdrawals extends Component {
	constructor(props) {
		super(props);
		this.UploadFile = this.UploadFile.bind(this);
		this.onUploadRequest = this.onUploadRequest.bind(this);
	}

	UploadFile(data) {
		this.props.uploadWithdrawals(data);
	};

	onUploadRequest() {
		this.props.uploadRequest();

	}
	render() {
		return (
			<div>
				<UploadForm onSubmit={this.UploadFile} onUploadRequest={this.onUploadRequest} />
				<div className="fixed-action-btn" />
			</div>
		);
	}
};

function mapStateToProps(state) {
	return {
		massUploadWithdrawals: state.massUploadWithdrawals
	};
}

export default connect(mapStateToProps, actions)(MassUploadWithdrawals);
