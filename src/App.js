import React, { Component } from 'react';
import './App.css';
import './../node_modules/animate.css'
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
      facility: null,
      showSidebar: false,
      overlayClass: 'map-overlay hidden',
      username: null,
      password: null,
      apiUrl: 'https://api.lodestarhealthdata.com/api/token',
      token: null,
      userLoggedIn: true // to do update this to actually verify user log in
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
    
    let _overlayClass = 'map-overlay animated slideInLeft'
    
    if (_facility === null) {
      _overlayClass = 'map-overlay hidden'
    }

    this.setState({
        facility: _facility,
        showSidebar: true,
        overlayClass: _overlayClass
    })
  }

  
  //*********************************** 
  // handler for accessing the tokens and login
  isUserLoggedIn(){
    const loggedIn = localStorage.getItem("token") !== null;
    this.setState({
      userLoggedIn: loggedIn
    }) 
    return loggedIn
  }        
  
  getSavedToken() {
    this.setState({
      token: localStorage.getItem("token")
    });
  }

  updateUsername = (evt) => {
    this.setState({username: evt.target.value});
  }
  
  updatePassword = (evt) => {
    this.setState({password: evt.target.value});
  }

  submitUser = (evt) => {
    // build url
    // this will use the API if not in developement mod
    let targetUrl = this.state.apiUrl;

    // handling production vs development in a simple way    
    if (window.location.href === "http://localhost:3000/") {
      targetUrl = "http://localhost:5000/api/token";
    } 

    let target = `${targetUrl}/?username=${this.state.username}&password=${this.state.password}`
    fetch(target, {
      method:'POST',
      headers : { 
        'Accept': 'application/json'
       }
    })
    .then((token) => token.json())
    .then(t => { 
        localStorage.setItem("token", t);
        this.isUserLoggedIn();
    });
  } 
  //***********************************
  

  render() {

    return (
      <div>
      { this.state.userLoggedIn === false ? <nav><input type="text" onChange={this.updateUsername} placeholder="b@b.com"/><input type="password" onChange={this.updatePassword} placeholder="P@55word"/><button onClick={this.submitUser}>Login</button>Navbar</nav> : null }
      <div className="">
        { this.state.userLoggedIn === true ? <InteractiveMap
          height={this.state.windowDimensions.height}
          width={this.state.windowDimensions.width}
          publishDetails={this.displayFacilityDetails}
        /> : null }
      <div className={this.state.overlayClass}>
        { this.state.showSidebar ? <FacilitySidebar onClick={this.hideSidebar} facility={this.state.facility} /> : null }
      </div>
      </div>
      </div>
      
    );
  }
}

export default App;

