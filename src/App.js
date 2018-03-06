import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  componentDidMount() {

    let targetUrl = 'https://api.lodestarhealthdata.com/api/Facility?latitude=55.5&longitude=45.4';
    
    // handling production vs development in a simple way
    console.log(window.location.href)
    
    if (window.location.href === "http://localhost:3000/") {
        targetUrl = "http://localhost:5000/api/Facility/?latitude=55.5&longitude=45.5";
    } 
    fetch (targetUrl)
    .then(result =>(result.json()))
    .then(data => console.log("data", {"url" :targetUrl, "data": data}));

  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
