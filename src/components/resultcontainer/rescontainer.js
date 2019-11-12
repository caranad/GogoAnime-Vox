/* eslint-disable */

import React, { Component } from 'react';
import './rescontainer.css'

import Result from '../result/result'

export default class ResultContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let animes = [];

        for (let i = 0; i < this.props.animes.length; i++) {
            animes.push(
                <Result key = { i } id = { i } anime = { this.props.animes[i].name } />
            )
        }

        return (
            <div className="searchResultContainer">
                <h3>Your search returned more than one result. Choose which version you want to watch.</h3>
                { animes }
            </div>
        )
    }
}