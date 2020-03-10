import React, { Component } from 'react';

import './LoadingBar.css'

class LoadingBar extends Component {

    render () {
        const { type } = this.props

        if (type === 'spinner') {
            return <div className="spinner" />
        } else if (type === 'small-spinner') {
            return <div className="small-spinner" />
        } else if (type === 'grid') {
            return <div className="loading-indicator_grid" >
                <div />
                <div />
                <div />
                <div />
                <div />
            </div>
        }
    }
}

export default LoadingBar
