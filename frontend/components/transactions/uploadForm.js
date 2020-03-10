import React from 'react';
import { connect } from 'react-redux';
import ReactFileReader from 'react-file-reader';
import ReactTable from 'react-table';
import { Glyphicon } from 'react-bootstrap';
import _ from 'lodash';

import * as actions from '../../actions/icos';
import './Transactions.css';


const ReactToastr = require('react-toastr');
const { ToastContainer } = ReactToastr;
const ToastMessageFactory = React.createFactory(
	ReactToastr.ToastMessage.animation
);

let self;

class UploadForm extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			fileName: 'No Selected',
			tableData: [],
			buttonStatus: false,
			ico: {},
			importedFlag: false

		};
		this.csvData = [];
		self = this;

	}

	componentWillMount() {
		this.props.fetchAllIcos();
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.transactions.uploadFlag === true) {
			this.refs.message.success('', 'Upload Success', {
				timeOut: 2000,
				extendedTimeOut: 2000
			});
			this.setState({ buttonStatus: false });

			this.props.onUploadRequest();
		} else if (nextProps.transactions.uploadFlag === false) {
			this.refs.message.error('', 'Upload Fail', {
				timeOut: 2000,
				extendedTimeOut: 2000
			});
			this.setState({ buttonStatus: false });

			this.props.onUploadRequest();

		}
		if(!_.isNil(nextProps.auth._ico)) {
			if(nextProps.icos.data.length > 0) {					
				nextProps.icos.data.map(item => {
					if(item._id == nextProps.auth._ico) {
						this.setState({ ico: item });
					}
				})
			}
		}

	}
	handleFiles = (files) => {
		const { auth, icos } = this.props;
		const { ico, importedFlag } = this.state;
		this.setState({ fileName: files[0].name });
		var reader = new FileReader();
		reader.onload = function (e) {
			// Use reader.result
			var csv = reader.result;
			csv = csv.replace(/"/g, '');
			var lines = csv.split("\n");
			var result = [];
			var headers = lines[0].split(",");
			for (var i = 1; i < lines.length; i++) {
				var obj = {};
				var currentline = lines[i].split(",");
				for (var j = 0; j < headers.length; j++) {
					obj[headers[j]] = currentline[j];
				}
				let ico = {};
				if(!_.isNil(auth._ico)) {
					if(icos.data.length > 0) {					
						icos.data.map(item => {
							if(item._id == auth._ico) {
								ico = item;
							}
						})
					}
					if(ico.name && ico.name == obj['ICO Name']) {
						obj.symbol = ico.symbol;
						result.push(obj);
					}
				} else
					result.push(obj);
			}
			self.csvData = result;
		}
		reader.onloadend = () => {
			this.setState({ tableData: self.csvData });
			this.setState({ importedFlag: true });
		}
		reader.readAsText(files[0]);
	}

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
	}

	render() {
		const { fileName, ico, importedFlag } = this.state;
		const { auth } = this.props;
		if(!_.isNil(auth._ico)) {
			if(importedFlag && this.state.tableData.length == 0) {				
				this.refs.message.error('', 'Import Error', {
					timeOut: 2000,
					extendedTimeOut: 2000
				});
			}
		}
		
		return (
			<div>
				<div className="row upload-form">
					<div className="form-group-row">
						<div className="col-md-10">
							<span className="file-reader">
								<ReactFileReader handleFiles={this.handleFiles} fileTypes={'.csv'}>
									<button className='btn'>Select CSV File<Glyphicon glyph="search" /></button>
								</ReactFileReader>
							</span>
							<span className="file-name">{fileName}</span>
						</div>
					</div>
					<div className="form-group-row">
						<div className="col-md-10">
							<span>
								<button className='btn' disabled={this.state.buttonStatus} onClick={this.uploadData}>Upload Data<Glyphicon glyph="open" /></button>
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
								Header: 'Curreny',
								id: 'Currency',
								accessor: "Currency",
								maxWidth: 150
							},
							{
								Header: 'Symbol',
								id: 'symbol',
								accessor: 'symbol',
								maxWidth: 150
							},
							{
								Header: 'Amount',
								id: 'Amount',
								accessor: "Amount",
								maxWidth: 100
							},
							{
								Header: 'txId',
								accessor: 'txhash/transaction id',
								id: 'txhash/transaction id'
							},
							{
								Header: 'Email',
								id: 'Investor e-mail',
								accessor: "Investor e-mail"
							},
							{
								Header: 'Date',
								id: 'Date',
								accessor: "Date"
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
};

// Decorate with reduxForm(). It will read the initialValues prop provided by connect()

function mapStateToProps(state) {
	return {
		withdrawal: state.withdrawal,
		transactions: state.transactions,
		auth: state.auth,
		icos: state.icos
	};
}

export default connect(mapStateToProps, actions)(UploadForm);
