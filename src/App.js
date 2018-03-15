import React, { Component } from 'react';
import './App.css';
import './../node_modules/animate.css'
import MapContainer from './components/MapContainer';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
      username: null,
      password: null,
      apiUrl: 'https://api.lodestarhealthdata.com/api/token',
      token: null,
      userLoggedIn: false // to do update this to actually verify user log in
    };
    
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

    // this will use the API if not in developement mod
    let targetUrl = this.state.apiUrl;

    // handling production vs development in a simple way    
    if (window.location.href === "http://localhost:3000/") {
      targetUrl = "http://localhost:5000/api/token";
    } 

    let target = `${targetUrl}/?=${this.state.username}&password=${this.state.password}`
    fetch(target, {
      method:'POST',
      headers : { 
        'Accept': 'application/json'
       }
    })
    .then((token) => 
      token.json()
    )
    .then(t => { 
        localStorage.setItem("token", t);
        this.isUserLoggedIn();
    });
  } 
  //***********************************
  

  render() {

    return (
      <div>
      { this.state.userLoggedIn === false ? 
      <nav>
        <input type="text" onChange={this.updateUsername}/>
        <input type="password" onChange={this.updatePassword}/>
        <button onClick={this.submitUser}>Login</button>
      </nav> : null }
      <MapContainer userLoggedIn={this.state.userLoggedIn} />
      
      </div>
      
    );
  }
}

export default App;

