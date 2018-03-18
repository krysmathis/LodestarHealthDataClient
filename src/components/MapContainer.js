import React from 'react';
import './../App.css';
import './../../node_modules/animate.css';
import InteractiveMap from './InteractiveMap';
import FacilitySidebar from './Facility-Sidebar';
import FacilityInfo from './Facility-Info';
import InfoContainer from './Info-Container';
import Navigation from './Navigation';
import getApiPath from '../utils/EnvironmentFinder';
import MapPopup from './MapPopup';



// The map container contains the sidebar and the interactive map
export default class MapContainer extends React.Component {
    constructor(props) {
      super(props);
       this.state = {
        mapStyle: "mapbox://styles/krysmathis/cjeimaj4r1k6w2rqeflmdfwc8",
        windowDimensions: {
          height: 800,
          width: 800
        },
        facility: null,
        facilitiesInRange: [],
        showSidebar: false,
        overlayClass: 'map-overlay hidden',
        token: null,
        facilities: [],
        avgMarkerSize: 6000
       }

       this.displayFacilityDetails = this.displayFacilityDetails.bind(this);
       this.getSavedToken = this.getSavedToken.bind(this);

    }
    
    componentDidMount = () => {

      this.updateDimensions();
      window.addEventListener("resize", this.updateDimensions);
      
      this.getFacilities(); 

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position =>
          console.log("navigator position ", position)
        );
      } 
    }
  
    updateDimensions = () => {
      const _windowDimensions = this.state.windowDimensions
      _windowDimensions.height = window.innerHeight-64;
      _windowDimensions.width = window.innerWidth;
      
      this.setState({
        _windowDimensions
      });
      
    };

  // update the facility information
  displayFacilityDetails(_facility,_nearby) {
    
    let _overlayClass = 'map-overlay animated slideInLeft'
    
    if (_facility === null) {
      _overlayClass = 'map-overlay hidden'
    }

    // update the nearby facilities to get the ones on top of it
    this.setState({
        facility: _facility,
        facilitiesInRange: _nearby,
        showSidebar: true,
        overlayClass: _overlayClass
    })
  
  }

  getSavedToken() {
    return localStorage.getItem("token")
  }



  // queries the API to return the listed facilities
  getFacilities()  {
    // this will use the API if not in developement mod

    
    fetch (getApiPath() + "/Facility", {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Authorization': 'Bearer ' + this.getSavedToken()
      }
    }).then(result =>{
      if(result.ok) {
        return result.json();
      }
    }) // convert to json
    .then(data => {
      if(data) {

            // TODO: capture the user's home location
            this.getHomeLocation();
            /*
              Calculate the average marker size in order to create a scalable
              marker size
            */
            const totalMarkerSize = data
                              .filter(f => f.cY_Discharges > 0)
                              .reduce(function (acc, obj) { return acc + obj.cY_Discharges; }, 0);
            const _avgMarkerSize = totalMarkerSize/data.length;
            
          
            this.setState({
                facilities: data,
                avgMarkerSize: _avgMarkerSize
            });
          }
        });
  }

  publishNearbyLocation = (id) => {
    const facility = this.state.facilitiesInRange.find(f => f.facilityId === id);
    this.submitSearchRequest(facility);
  }

  submitSearchRequest = (facility) => {
    this.map._searchFormSubmit(facility);
  }

  updateUsernameInNav = (username) => {
    this.nav.updateLoggedIn(username);
    this.getHomeLocation();
  }

  /*
    Allow the user to post a home location to the database
  */
  submitHomeLocation = (latitude, longitude) => {

    if (this.props.userLoggedIn === null) {
      return;
    }

    fetch (getApiPath()+ `/homelocation?username=${this.props.userLoggedIn}&latitude=${latitude}&longitude=${longitude}`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Authorization': 'Bearer ' + this.getSavedToken()
      }
    }).then(result =>{
      if(result.ok) {
        console.log(result.json())
      }
    }) // convert to json

  }

  getHomeLocation = () => {
    
    if (this.props.userLoggedIn === null) {
      return;
    }

    fetch (getApiPath()+ `/homelocation?username=${this.props.userLoggedIn}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Authorization': 'Bearer ' + this.getSavedToken()
      }
    }).then(result =>{
      if(result.ok) {
        return result.json()
      }
    }).then(r => {
    
      if (r !== undefined) {
        const _lat = r.lat;
        const _lon = r.lon;
  
        // adjust the viewport to the saved location
        this.map._goToViewport(_lon,_lat, 8.5);
      }

    }) // convert to json

  }



  renderFacilityInfo() {

    const {facility} = this.state;

    return facility && (
      <InfoContainer
        onClose={() => {
          this.setState({facility: null})
          this.displayFacilityDetails(null)
          }} >

        <FacilityInfo info={facility} setHomeLocation={this.submitHomeLocation}/>
      </InfoContainer>
    );
  }


  render() {
    return (
      <div className="">
      <Navigation ref={nav => {this.nav = nav}} userLogOut={this.props.userLogOut} facilities={this.state.facilities} onSubmit={this.props.onSubmit} userLoggedIn={this.props.userLoggedIn} onFacilitySubmit={this.submitSearchRequest}/>
        <div className='viewport-full relative scroll-hidden'>
          { // this is the loading display
            this.state.facilities.length === 0 ?
            <div className='flex-parent flex-parent--center-cross flex-parent--center-main absolute top right bottom left bg-darken10 z5'>
              <div className='flex-child loading'></div>
            </div> : null
          }
          <div>
              { <InteractiveMap 
                height={this.state.windowDimensions.height}
                width={this.state.windowDimensions.width}
                publishDetails={this.displayFacilityDetails}
                facilities={this.state.facilities}
                ref={map => { this.map = map; }}
                avgMarkerSize={this.state.avgMarkerSize}
                setHomeLocation={this.submitHomeLocation}
              /> }
          </div>
          </div>
              {/* this is where the info shows up - needs a better name */}
              {this.renderFacilityInfo()}
            <div className={this.state.overlayClass}>
              { this.state.showSidebar ? 
              <div>
                <FacilitySidebar onClick={this.publishNearbyLocation} facility={this.state.facilities} facilitiesInRange={this.state.facilitiesInRange}/> 
                </div>: 
                null 
              }
            </div>
          </div>
        
        
    )
  }
}