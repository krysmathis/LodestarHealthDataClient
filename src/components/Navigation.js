import React, { Component } from 'react';
import FilterBox from './Filter-Box';
import './InteractiveMap.css';
/* 
    The navbar will have the following props:
        - facilities: an array of all the facilities to filter
        - function to call when the facility is clicked
        - status indicator if the user is logged in
*/

export default class Navigation extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            username: null,
            password: null,
            facilityId: null,
            loggedIn: null
        };    
        this.updatePassword = this.updatePassword.bind(this);
        this.updateUsername = this.updateUsername.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        
        this.setState({
            loggedIn: nextProps.userLoggedIn
        })
    }

    updateLoggedIn = (username) => {
        // check if there is a token first
        if (localStorage.getItem("token") !== null) {
            this.setState({
                loggedIn: username
            })
        }
    }
    
    updateUsername = (evt) => {
        this.setState({username: evt.target.value});
    }
    
    updatePassword = (evt) => {
    this.setState({password: evt.target.value});
    }
    
    /*
        Description:
        This function will lift pass the values entered in the 
        username and password boxes up two parents,
        the MapContainer component and then finally to the App.
        The App handles the user log in and out functionality.
    */

    submitUser = () => {

        const {username, password} = this.state;
        
        // validate that both inputs have text
        if (username.length > 0 && password.length > 0) {
            this.props.onSubmit(username, password);
        }
    }

    logout = () => {
        this.props.userLogOut();
        this.setState({
            loggedIn: null
        })
    }

    
    /*
        Description:
        In the render function, the program creates a reference to the 
        child object <InteractiveMap /> and then calls a method on 
        the child object, passing a facility object as a parameter 
    */
    submitFacility = (facility) => {
        this.props.onFacilitySubmit(facility);
    }
    
    render() {

        return (
           
            <nav className="mapContainer__nav">
                <div className="filterBox">
                    <FilterBox facilities={this.props.facilities} onSubmit={this.submitFacility}/>
                </div>
            { this.state.loggedIn === null ? 
                <div className="nav__user-login flex-parent">
                    <input className='input border-r--0 round-l' label="username" type="text" placeholder="username" onChange={this.updateUsername}/>
                    <input className='input border-r--0 round-l' abel="password" type="password" placeholder="password" onChange={this.updatePassword}/>
                    <button className='btn px24 round-r' onClick={this.submitUser}>Login</button>
                </div>
            : <div className="nav__user-logout">
                <div className='nav__user-logged-in'>{this.props.userLoggedIn}</div> 
                <button className='btn px24 round-r' onClick={this.logout}>Logout</button>
            </div> 
            }
                
                
            </nav> 
        )
    }

    



    
}   