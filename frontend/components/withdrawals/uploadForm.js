import React from 'react';
import { connect } from 'react-redux';
import ReactFileReader from 'react-file-reader';
import ReactTable from 'react-table';
import csv from 'csvtojson';
import { Glyphicon } from 'react-bootstrap';
import './Withdrawal.css';

const ReactToastr = require('react-toastr');
const { ToastContainer } = ReactToastr;
const ToastMessageFactory = React.createFactory(
	ReactToastr.ToastMessage.animation
);

let self;

class UploadForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			fileName: 'No Selected',
			tableData: [],
			buttonStatus: false
		};
		this.csvData = [];
		self = this;
	}
	componentWillReceiveProps(nextProps) {
		console.log(nextProps);
		if (nextProps.withdrawal.uploadFlag === true) {
			this.refs.message.success('', 'Upload Success', {
				timeOut: 2000,
				extendedTimeOut: 2000
			});
			this.setState({ buttonStatus: false });
			this.props.onUploadRequest();
		} else if (nextProps.withdrawal.uploadFlag === false) {
			this.refs.message.error('', 'Upload Fail', {
				timeOut: 2000,
				extendedTimeOut: 2000
			});
			this.setState({ buttonStatus: false });
			this.props.onUploadRequest();
		}
	}
	handleFiles = files => {
		this.setState({ fileName: files[0].name });
		const reader = new FileReader();
		let result = [];
		reader.onload = function(e) {
			csv()
				.fromString(reader.result)
				.on('json', jsonObj => {
					result.push(jsonObj);
				});
			self.csvData = result;
			//console.log(self.csvData);
		};
		reader.onloadend = () => {
			this.setState({ tableData: self.csvData });
			//console.log(this.state.tableData);
		};
		reader.readAsText(files[0]);
	};

	uploadData = () => {
		if (this.csvData.length > 0) {
			this.setState({ buttonStatus: true });
			this.props.onSubmit(this.csvData);
		} else {
			this.refs.message.error('', 'Please select file', {
				timeOut: 2000,
				extendedTimeOut: 2000
			});
		}
	};
	render() {
		const { fileName } = this.state;
		return (
			<div>
				<div className="row upload-form">
					<div className="form-group-row">
						<div className="col-md-10">
							<span className="file-reader">
								<ReactFileReader
									handleFiles={this.handleFiles}
									fileTypes={'.csv'}
								>
									<button className="btn">
										Select CSV File<Glyphicon glyph="search" />
									</button>
								</ReactFileReader>
							</span>
							<span className="file-name">{fileName}</span>
						</div>
					</div>
					<div className="form-group-row">
						<div className="col-md-10">
							<span>
								<button
									className="btn"
									disabled={this.state.buttonStatus}
									onClick={this.uploadData}
								>
									Upload Data<Glyphicon glyph="open" />
								</button>
							</span>
						</div>
					</div>
				</div>
				<ToastContainer
					ref="message"
					toastMessageFactory={ToastMessageFactory}
					className="toast-top-right"
				/>
				<div className="row">
					<ReactTable
						columns={[
							{
								Header: 'ID',
								id: 'id',
								accessor: 'id'
							},
							{
								Header: 'Status',
								id: 'status_name',
								accessor: d => {
									return d.status_name;
								}
							},
							{
								Header: 'txId',
								id: 'txId',
								accessor: d => d.txId
							}
						]}
						data={this.state.tableData}
						filterable
						defaultPageSize={20}
						className="-striped -highlight"
					/>
				</div>
			</div>
		);
	}
}

// Decorate with reduxForm(). It will read the initialValues prop provided by connect()

function mapStateToProps(state) {
	return {
		withdrawal: state.withdrawal,
		transactions: state.transactions,
		auth: state.auth
	};
}

export default connect(mapStateToProps, null)(UploadForm);
