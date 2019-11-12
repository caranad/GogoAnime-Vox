/* eslint-disable */
import React, { Component } from 'react';
import './header.css';

// Component
import VoiceSearch from '../voicesearch/voicesearch';

export default class Header extends Component {
    constructor(props) {
        super(props);
    }

    getResult = (data) => {
        this.props.getEpisode(data);
    }

    getError = (err) => {
        this.props.getError(err);
    }

    render() {
        return (
            <div className="gogoanimeHeader">
                <VoiceSearch 
                    passData = { this.getResult } 
                    passError = { this.getError } 
                />
            </div>
        )
    }
}