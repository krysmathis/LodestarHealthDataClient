import React, { Component } from 'react';
import './App.css';
import './../node_modules/animate.css'
import MapContainer from './components/MapContainer';
import getApiPath from './utils/EnvironmentFinder';

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
   
    if (localStorage.getItem("token") !== null) {
      fetch (getApiPath() + "/token", {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token")
        }
      }).then(result =>{

        if(result.ok) {
          return result.json();
        }
      }).then(r => {
        this.setState({
          userLoggedIn: r.username
        }, () => this.container.updateUsernameInNav(r.username))
      })
    } else {
      this.setState({
        userLoggedIn: null
      }) 
    }

  }        
  
 
  
  submitUser = (username, password) => {


    let target = `${getApiPath()}/?=${username}&password=${password}`
    
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

  logoutUser = () => {
    localStorage.removeItem("token");
    this.setState({
      token: null,
      userLoggedIn: null
    })
  }
  //***********************************
  

  render() {

    return (
      <div>
      <MapContainer ref={container => {this.container = container}} userLoggedIn={this.state.userLoggedIn} userLogOut={this.logoutUser} onSubmit={this.submitUser}/>
      
      </div>
      
    );
  }
}

export default App;

