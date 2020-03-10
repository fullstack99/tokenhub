import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions/transaction';

class RefundTransaction extends Component {

    constructor(props) {
        super(props)

        this.state = {
            amount: "",
            address: "",
            txid: ""
        }
    }

    setValue = (e, type) => {
        this.setState({[type]: e.target.value})
    }

    createTransaction = () => {
        const { selectedTransacton } = this.props;
        if(parseFloat(this.state.amount) > parseFloat(selectedTransacton.transaction.amount)) {
            this.props.transactionRequestFail()
        } else {
            const data = { 
                type: 'refund', 
                _investor: selectedTransacton.investor._id,
                _ico: selectedTransacton.ico._id, 
                currency: selectedTransacton.transaction.currency, 
                xRate: selectedTransacton.transaction.xRate, 
                status: 'confirmed',
                address: this.state.address, 
                amount: this.state.amount, 
                txId: `${selectedTransacton.investor._id}_${this.state.txid}_${Date.now()}`
            }
            this.props.refundTransaction(data)
        }
        
        this.props.onClose()
    }

    render() {
        const { selectedTransacton } = this.props;

        return (
            <div className="refund-transaction-modal modal-dialog">
                <i className="tine material-icons btn-close" onClick={this.props.onClose}>close</i>
                <div className="row">
                    <div className="col-sm-12">
                        <form className="refund-transaction-form">
                            <div className="form-group">
                                <label>Investor</label>
                                <input type="text" value={selectedTransacton.investor.email} name="" readOnly />
                            </div>
                            <div className="form-group">
                                <label>ICO</label>
                                <input type="text" value={selectedTransacton.ico.name} name="" readOnly />
                            </div>
                            <div className="form-group">
                                <label>xRate</label>
                                <input type="text" value={selectedTransacton.transaction.xRate} name="" readOnly />
                            </div>
                            <div className="form-group">
                                <label>Currency</label>
                                <input type="text" value={selectedTransacton.transaction.currency} name="" readOnly />
                            </div>
                            <div className="form-group">
                                <label>Amount</label>
                                <input type="text" value={this.state.amount} onChange={(e) => this.setValue(e, "amount")} />
                            </div>
                             <div className="form-group">
                                <label>Address</label>
                                <input type="text" value={this.state.address} onChange={(e) => this.setValue(e, "address")} />
                            </div>
                            <div className="form-group">
                                <label>TxID</label>
                                <input type="text" value={this.state.txid} onChange={(e) => this.setValue(e, "txid")} />
                            </div>
                            <div className="form-group">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={this.createTransaction}
                                >Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(null, actions)(RefundTransaction)