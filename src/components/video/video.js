/* eslint-disable */
import React, { Component } from 'react';
import TweenMax from 'gsap';
import './video.css';

export default class Video extends Component {
    constructor(props) {
        super(props);
    }

    close = () => {
        TweenMax.to(".videoContainer", 3, {
            height: "0%",
            display: "none"
        })

        TweenMax.to("#myIframe", 3, {
            height: "0%",
        })

        document.querySelector("#myIframe").setAttribute("src", "about:blank");
        this.props.close();
    }
    
    render() {
        return (
            <div className="videoContainer">
                <iframe id="myIframe" src = { this.props.url }></iframe>
                <div className="videoContainerClose" onClick={ this.close }>X</div>
            </div>
        )
    }
}