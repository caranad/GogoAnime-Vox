/* eslint-disable */
import React, { Component } from 'react';
import './homepage.css';

import Header from '../header/header';
import Video from '../video/video';
import Error from '../error/error';

import TweenMax from 'gsap';

export default class Homepage extends Component {
    state = {
        url: "", 
        error: ""
    }

    constructor() {
        super();
    }

    updateVideo = (data) => {
        this.setState({
            url: data,
            error: ""
        })

        TweenMax.to(".videoContainer", 3, {
            height: "100%",
            display: "block"
        })

        TweenMax.to("#myIframe", 3, {
            height: "80%",
            width: "60%"
        })
    }

    updateError = (err) => {
        this.setState({
            error: err
        })
    }

    removeUrl = () => {
        this.setState({
            url: "",
        })
    }

    render() {
        return (
            <div className="gogoanimeVoiceSearch">
                <Video url = { this.state.url } close = { this.removeUrl }/>
                <Header getEpisode = { this.updateVideo } getError = { this.updateError }/>
                <Error error = { this.state.error }/>
            </div>
        )
    }
}