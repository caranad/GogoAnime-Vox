/* eslint-disable */

import React, { Component } from 'react';
import './result.css'

export default class Result extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="gogoAnimeTitle">
                <b>Option { this.props.id + 1 }:</b> { this.props.anime }
            </div>
        )
    }
}