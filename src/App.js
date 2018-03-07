import React, { Component } from 'react';
import './App.css';
import InteractiveMap from "./components/InteractiveMap.js";
import FacilitySidebar from './components/Facility-Sidebar';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      windowDimensions: {
        height: 800,
        width: 800
      },
      facility: null
    };
    this.displayFacilityDetails = this.displayFacilityDetails.bind(this);
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

  // update the facility information
  displayFacilityDetails(_facility) {
    this.setState({
        facility: _facility
    })
  }

  render() {

    return (
      <div>
      <div className="">
        <InteractiveMap
          height={this.state.windowDimensions.height}
          width={this.state.windowDimensions.width}
          publishDetails={this.displayFacilityDetails}
        />
      </div>
      <div className="map-overlay">
        <FacilitySidebar facility={this.state.facility} />
      </div>
      </div>
      
    );
  }
}

export default App;

