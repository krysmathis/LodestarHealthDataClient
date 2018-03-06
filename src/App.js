import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  componentDidMount() {
    const targetUrl = 'https://api.lodestarhealthdata.com/api/Facility?latitude=55.5&longitude=45.4'
    fetch (targetUrl)
    .then(result =>(result.json()))
    .then(data => console.log(data));

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
