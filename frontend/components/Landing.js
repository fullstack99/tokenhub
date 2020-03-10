
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

class Landing extends Component {
	constructor(props) {
		super(props);
	}
	componentDidMount() {
		this.props.initialStore();
	}
	render() {
		return (
			<div style={{ textAlign: 'center' }}>
				<h1>TokenHub management dashboard</h1>
			</div>
		);
	}
};

export default connect(null, actions)(Landing);
