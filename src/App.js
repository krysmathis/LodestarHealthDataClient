import React, { Component } from 'react';
import './App.css';
import InteractiveMap from "./components/InteractiveMap.js";


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      windowDimensions: {
        height: 800,
        width: 800
      }
    };
  }

  componentDidMount = () => {

    this._updateDimensions();
    window.addEventListener("resize", this._updateDimensions);
  }

  _updateDimensions = () => {

    const _windowDimensions = this.state.windowDimensions
    _windowDimensions.height = window.innerHeight;
    _windowDimensions.width = window.innerWidth;
    
    this.setState({
      _windowDimensions
    });
    
  };


  render() {

    return (
      <InteractiveMap
        height={this.state.windowDimensions.height}
        width={this.state.windowDimensions.width}
      />
    );
  }
}

export default App;

