import React, { Component } from 'react';
import FilterBox from './Filter-Box';
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

    componentWillMount() {
        
        console.log("Mounting with:", this.props);
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
            { this.state.loggedIn === null ? 
                <div>
                    <input type="text" onChange={this.updateUsername}/>
                    <input type="password" onChange={this.updatePassword}/>
                    <button onClick={this.submitUser}>Login</button>
                </div>
           : <div>{this.props.userLoggedIn} <button>Logout</button></div> }
            <div className="filterBox">
                <FilterBox facilities={this.props.facilities} onSubmit={this.submitFacility}/>
            </div>
            </nav> 
        )
    }

    



    
}   