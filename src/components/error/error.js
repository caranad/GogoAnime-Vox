/* eslint-disable */

import React, { Component } from 'react';
import './error.css';

export default class Error extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="errorContainer">
                { this.props.error }
            </div>
        )
    }
}