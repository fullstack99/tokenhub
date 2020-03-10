import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions/xRates';

class FilterXRate extends Component {

    constructor(props) {
        super(props)

        this.state = {
            newXRate: "",
            preXRate: ""
        }

        this.applyPreviousRate = this.applyPreviousRate.bind(this)
        this.applyPro = this.applyPro.bind(this)
        this.applyAllTransaction = this.applyAllTransaction.bind(this)
    }

    componentDidMount () {
        this.setState({ newXRate: this.props.selectedXRate.rate })
        this.setState({ preXRate: this.props.selectedXRate })
    }
    
    setNewXRate(e) {
        if(!isNaN(e.target.value )) {
            this.setState({ newXRate: e.target.value })
        }
        e.preventDefault();
    }

    applyPro() {
        this.props.onClose()
    }

    applyPreviousRate() {
        console.log(this.state.preXRate)
        this.props.onClose()
    }

    applyAllTransaction() {
        this.props.fetchUpdateXRate(
            this.props.selectedICO,
            this.state.preXRate.date,
            this.state.preXRate.currency,
            this.state.newXRate
        )
        this.props.onClose()
    }

    render() {
        const { newXRate } = this.state;
        const { selectedXRate, selectedICO } = this.props;

        if(!this.props.show) {
            return null;
        }
     
        return (
            <div className="xrate-modal modal-dialog">
                <i className="tine material-icons btn-close" onClick={this.props.onClose}>close</i>
                <form className="form row">
                    <div className="col-sm-12">
                        <div className="col-xs-12 col-sm-6">
                            <label>{selectedXRate.date.substring(0, 10)}</label>
                        </div>                        
                        <div className="col-xs-12 col-sm-6">
                            <input type="text"
                                value={newXRate}
                                onChange={this.setNewXRate.bind(this)}
                                className="form-control"/>
                        </div>
                        
                    </div>
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="col-xs-12 col-md-3">
                                <button 
                                    type="button"
                                    className="btn btn-default"
                                    onClick={this.props.onClose}>Cancel</button>
                            </div>
                            <div className="col-xs-12 col-md-3">
                                <button 
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={this.applyPro}>Save and Apply prospectively</button>
                            </div>
                            <div className="col-xs-12 col-md-3">
                                <button 
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={this.applyPreviousRate}>Save and apply retrospectively only to transactions with[previous rate]</button>
                            </div>
                            <div className="col-xs-12 col-md-3">
                                <button 
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={this.applyAllTransaction}>Save and apply retrospectively for all transactions</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default connect(null, actions)(FilterXRate)