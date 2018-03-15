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
      userLoggedIn: null // to do update this to actually verify user log in
    };
    
    this.getSavedToken = this.getSavedToken.bind(this);
  }

  
  //*********************************** 
  // handler for accessing the tokens and login
  componentWillMount() {
    this.getSavedToken();
  }

  getSavedToken()  {
    const _token = {token: localStorage.getItem("token")}
    this.setState(_token,() => this.isUserLoggedIn());
    
  }

  isUserLoggedIn(){
   
    if (this.state.token !== null) {
      fetch (this.state.apiUrl, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Authorization': 'Bearer ' + this.state.token
        }
      }).then(result =>{

        if(result.ok) {
          return result.json();
        }
      }).then(r => {
        this.setState({
          userLoggedIn: r.username
        })
      })
    } else {
      this.setState({
        userLoggedIn: null
      }) 
    }

  }        
  
 
  
  submitUser = (username, password) => {

    // this will use the API if not in developement mod
    let targetUrl = this.state.apiUrl;

    // handling production vs development in a simple way    
    if (window.location.href === "http://localhost:3000/") {
      targetUrl = "http://localhost:5000/api/token";
    } 

    let target = `${targetUrl}/?=${username}&password=${password}`
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
      <MapContainer userLoggedIn={this.state.userLoggedIn} onSubmit={this.submitUser}/>
      
      </div>
      
    );
  }
}

export default App;

