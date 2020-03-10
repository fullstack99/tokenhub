import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import LoadingBar from '../loadingBar/LoadingBar';

import * as actions from '../../actions/icos';

// import './IcoList.css';

class IcosList extends Component {

	constructor(props) {
		super(props);

		this.state = {
			selectedIco: ""
		}

		this.selectIco = this.selectIco.bind(this);
	}

	componentWillMount() {
		this.props.fetchAllIcos();
	}

	selectIco(e) {
		this.setState({ selectedIco: e.target.value })
		this.props.selectIco(e.target.value)
	}

	render() {
		const { icos, auth } = this.props;
		const { selectedIco } = this.state;

		if (icos.data.length > 0) {
			if(!_.isNil(auth._ico)) {
				let temp =[];
				icos.data.map(ico => {
					if(ico._id == auth._ico) {
						temp.push(ico);
					}
				});
				icos.data = temp;
			}
			return (
				<div className="ico-list">
					<label htmlFor="selected-ico">Select ICO</label>
					<select value={selectedIco} onChange={this.selectIco} id="selected-ico" className="form-control">
						{
							icos.data.map(ico => (
								<option value={ico._id} key={ico._id}>{ico.name}</option>
							))
						}
					</select>
				</div>
			);
		} else {
			return (
				null
			)
		}

	}
};

function mapStateToProps(state) {
	return {
		icos: state.icos,
		auth: state.auth
	};
}

export default connect(mapStateToProps, actions)(IcosList);
