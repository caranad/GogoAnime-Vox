/* eslint-disable */
import React, { Component } from 'react';
import './App.css';

// Components To Import 
import Homepage from './components/homepage/homepage'
import TweenMax from 'gsap';

class App extends Component {
  componentDidMount() {
    TweenMax.to(".gogoanimeApp", 3, {
      opacity: 1
    })
  }

  render() {
    return (
      <div className="gogoanimeApp">
        <Homepage/>
      </div>
    );
  }
}

export default App;
