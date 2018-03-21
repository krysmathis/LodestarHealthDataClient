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
            passwordClass: 'input round-l'
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
        
        const strongPassword = new RegExp("(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$");
        const classNames = ['password__input-invalid', 'password__input-valid']
        
        let strength = classNames[0]
        if (strongPassword.test(evt.target.value)) {
            strength = classNames[1]
        }
        this.setState({
            password: evt.target.value,
            passwordClass: strength
        });
    }

    renderUserLogin = () => {
    
        if (this.state.loggedIn === null) {
           return (<div className="nav__user-login flex-parent column">
                <label>Username</label>
                <input className='input round-l' label="username" type="text" placeholder="username" onChange={this.updateUsername}/>
                <label>Password</label>
                <input className={this.state.passwordClass} abel="password" type="password" placeholder="password" onChange={this.updatePassword}/>
                <p>Password must be 8 characters, contain 1 digit, 1 special character, 1 lower case letter and 1 uppercase letter. </p>
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
        const strongPassword = new RegExp("(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$");

        // validate that both inputs have text
        if (username.length > 0 && strongPassword.test(password) > 0) {
            this.props.onSubmit(username, password);
        } else {
            alert("not strong enough");
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
                containerClass={'infoContainer height-50'}
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