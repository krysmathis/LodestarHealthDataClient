import React, { Component } from 'react';
import FilterBox from './Filter-Box';
import './InteractiveMap.css';
import './Navigation.css'
import InfoContainer from './Info-Container';
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
            loggedIn: null,
            showFilter: false,
            showLogin: false,
            showSidebar: false,
        };    
        this.updatePassword = this.updatePassword.bind(this);
        this.updateUsername = this.updateUsername.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        
        this.setState({
            loggedIn: nextProps.userLoggedIn
        })
    }

    // toggle the filter
    showLoginSidebar = () => {
        const prevState = this.state
        let show = prevState.showLogin === true ? false : true

        this.props.toggle(null);
        
        this.setState({
            showLogin: show,
            showSidebar: show,
            showFilter: false
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

    renderUserLogin = () => {
    
        if (this.state.loggedIn === null) {
           return (<div className="nav__user-login flex-parent">
                <input className='input border-r--0 round-l' label="username" type="text" placeholder="username" onChange={this.updateUsername}/>
                <input className='input border-r--0 round-l' abel="password" type="password" placeholder="password" onChange={this.updatePassword}/>
                <button className='btn px24 round-r' onClick={this.submitUser}>Login</button>
            </div>)
        } else {
            return (<div className="nav__user-logout">
            <div className='nav__user-logged-in'>{this.props.userLoggedIn}</div> 
            <button className='btn px24 round-r' onClick={this.logout}>Logout</button>
            </div> )
        }
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

    // toggle the filter
    showFilterSidebar = () => {
        const prevState = this.state
        let show = prevState.showFilter === true ? false : true
        this.setState({
            showFilter: show,
            showSidebar: show,
            showLogin: false
        })    
        this.props.toggle(null);
    }


    /*
        Description:
        In the render function, the program creates a reference to the 
        child object <InteractiveMap /> and then calls a method on 
        the child object, passing a facility object as a parameter 
    */
    submitFacility = (facility) => {
        this.props.onFacilitySubmit(facility);
        this.setState({
            showFilter: false,
            showSidebar: false
        })  
    }

    // Function to send the user to their home location
    sendUserHome = () => {
        this.props.goHome(this.state.loggedIn !== null)
        this.setState({
            showFilter: false,
            showSidebar: false
        }) 
    }
    
    render() {
        // the nav bar will control the user login and filter box
        return (
            <div>
            
            <nav className="sidenav">
            
            <button className="nav__btn" onClick={this.showFilterSidebar}><svg className='icon h36 w36'><use xlinkHref='#icon-search'/></svg></button>
            <button className="nav__btn" onClick={this.showLoginSidebar}><svg className='icon h36 w36'><use xlinkHref='#icon-user'/></svg></button>
            <button className="nav__btn" onClick={this.sendUserHome}><svg className='icon h36 w36'><use xlinkHref='#icon-home'/></svg></button>
             
            
            </nav> 

            {this.state.showLogin ?
                <InfoContainer
                containerClass={'infoContainer'}
                >
                <div className="full-width">
                    {this.renderUserLogin()}
                </div>
            </InfoContainer>
            : null }

            { this.state.showFilter ? 
            <InfoContainer
            containerClass={'infoContainer'}
               >
                <div className="full-width">
                    <FilterBox facilities={this.props.facilities} onSubmit={this.submitFacility}/>
                </div>
            </InfoContainer>
            : null}
            </div>
        )
    }

    



    
}   