import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

import UploadForm from './transactions/uploadForm';
import { bindActionCreators } from 'redux';

class MassUploadTransactions extends Component {
	constructor(props) {
		super(props);
		this.UploadFile = this.UploadFile.bind(this);
		this.onUploadRequest = this.onUploadRequest.bind(this);
	}

	UploadFile(data) {
		console.log(data);
		this.props.uploadTransactions(data);
	};
	onUploadRequest() {
		this.props.transactionRequest();
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
		massUpload: state.massUpload
	};
}

export default connect(mapStateToProps, actions)(MassUploadTransactions);
