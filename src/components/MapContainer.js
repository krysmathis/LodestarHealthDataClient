import React from 'react';
import './../App.css';
import './../../node_modules/animate.css';
import InteractiveMap from './InteractiveMap';
import FacilitySidebar from './Facility-Sidebar';
import FacilityInfo from './Facility-Info';
import InfoContainer from './Info-Container';
import Navigation from './Navigation';
import getApiPath from '../utils/EnvironmentFinder';
import Swipe from 'react-swipe-component';


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
        allFacilities: [],
        showSidebar: false,
        overlayClass: 'map-overlay hidden',
        token: null,
        facilities: [],
        avgMarkerSize: 6000,
        homeLocation: []
       }

       this.displayFacilityDetails = this.displayFacilityDetails.bind(this);
       this.getSavedToken = this.getSavedToken.bind(this);

    }
    
    componentDidMount = () => {

      this.updateDimensions();
      window.addEventListener("resize", this.updateDimensions);
      
      this.getFacilities(); 
      if (navigator.geolocation) {
       
        navigator.geolocation.getCurrentPosition(position => {          
          this.setState({
            homeLocation: [position.coords.longitude, position.coords.latitude]
          })
        });
      } 
    }
  
    updateDimensions = (offset) => {

      // when the viewport is small do not offset the map because
      // the info box is going to show over the map
      
      const _offset = offset > 0 ? offset : 0;
      const _windowDimensions = this.state.windowDimensions
      _windowDimensions.height = window.innerHeight;
      
      if (window.innerWidth < 700) {
        _windowDimensions.width = window.innerWidth;
      } else {
        _windowDimensions.width = window.innerWidth - (window.innerWidth * _offset);
      }
      
      this.setState({
        _windowDimensions
      });
      
    };

  

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
        'Authorization': 'Bearer ' + this.getSavedToken(),
        'Access-Control-Allow-Origin': 'https://blissful-kare-a8283f.netlify.app'
        
      }
    }).then(result =>{
      if(result.ok) {
        return result.json();
      }
    }) // convert to json
    .then(data => {
      if(data) {

            // The API stores a home location for each user if logged in
            this.getHomeLocation();
            /*
              Calculate the average marker size in order to create a scalable
              marker size
            */
            const totalMarkerSize = data
                              .filter(f => f.cY_Discharges > 0 && f.cY_Discharges < 60000)
                              .reduce(function (acc, obj) { return acc + obj.cY_Discharges; }, 0);
            
            const _avgCY_Discharges = totalMarkerSize/data.length;
            
            data.sort((a,b) => a.cY_Discharges - b.cY_Discharges)
            this.setState({
                facilities: data,
                avgMarkerSize: _avgCY_Discharges
            }, () => this.calcAverages);
          }
        });
  }

  // update the facility information
  // TODO: rename this to overlapping facilities box
  displayFacilityDetails(_facility,_nearby, allFacilities) {
    
    let _overlayClass = 'map-overlay animated slideUpBottom'
    
    if (_facility === null || _nearby.length <= 1) {
      _overlayClass = 'map-overlay hidden'

    }

    // update the nearby facilities to get the ones on top of it
    this.setState({
        facility: _facility,
        facilitiesInRange: _nearby,
        allFacilities: allFacilities,
        showSidebar: true,
        overlayClass: _overlayClass,
    })

    if (_facility === null) {
      this.updateDimensions(0);
      setTimeout(this.map.clearPopupInfo(),100);
    } else {
      // now move the map over
      this.updateDimensions(.4);
    }
  
  }

  clearFacility = () => {
    
    this.setState({
      facility: null,
    }, () => this.displayFacilityDetails(null))
  }

  closeSidebar = () => {
    this.setState({
      showSidebar: false
    })
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
      // save it to local storage
      const coords = {latitude: latitude, longitude: longitude}
      localStorage.setItem("Home",JSON.stringify(coords));
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
        this.setState({
          homeLocation: [longitude, latitude]
        })
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
        
        // store the home location
        this.setState({
          homeLocation: [_lon, _lat]
        })

        // adjust the viewport to the saved location
        this.map._goToViewport(_lon,_lat, 10.5);
      }

    }) // convert to json

  }
  
  // send the user to the home location
    /*
Go to home location, if the user is logged in use the one supplied as a prop
if not then use the one from the navigator
    */
  

  goToHomeLocation = (loggedIn) => {
       
     // this should clear the facility popup
     setTimeout(() => {
       
      if (this.props.userLoggedIn) {
        // update the viewport
         const home = this.state.homeLocation
         this.map._goToViewport( home[0], home[1], 10.5);
      } else {
          // use the navigator to get the user's current location
          // the update the navigator
          if (localStorage.getItem("Home")) {
            const location = JSON.parse(localStorage.getItem("Home"))
            this.map._goToViewport(location.longitude, location.latitude, 10.5);
          // otherwise check and see if a home locaiotn is set
          } else if (this.state.homeLocation.length > 0) {
            const location = this.state.homeLocation;
            this.map._goToViewport(location[0], location[1], 10.5);
          } 
          
      }
     },100)
      
    setTimeout(this.clearFacility(), 100);
      
        
    }


  _onSwipeListener = () => {
    this.displayFacilityDetails(null);
  }

  renderFacilityInfo() {

    // TODO: toggle off if the nav element is clicked
    const {facility} = this.state;

    return facility && (
      <Swipe
      nodeName="div"
      className="test"
      onSwipedRight={this._onSwipeListener} 
      onSwipedLeft={this._onSwipeListener} 
      mouseSwipe={true}
      >
      <InfoContainer
        containerClass={'infoContainer-no-border'}
        className={"facility__container animated fadeInRight"}
        onClose={() => {
          this.setState({facility: null})
          this.displayFacilityDetails(null)
          }} >
        <FacilityInfo info={facility} comparisonData={this.state.allFacilities} setHomeLocation={this.submitHomeLocation} handleClose={this.displayFacilityDetails}/>
      </InfoContainer>
      </Swipe>
    );
  }


  render() {
    return (
      <div className="">
      <Navigation ref={nav => {this.nav = nav}} userLogOut={this.props.userLogOut} facilities={this.state.facilities} onSubmit={this.props.onSubmit} userLoggedIn={this.props.userLoggedIn} onFacilitySubmit={this.submitSearchRequest} toggle={this.displayFacilityDetails} goHome={this.goToHomeLocation}/>
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
                  {this.renderFacilityInfo()}
            <div className={this.state.overlayClass}>
              { this.state.showSidebar ? 
              <div>
                <FacilitySidebar onClick={this.publishNearbyLocation} facility={this.state.facilities} closeSidebar={this.closeSidebar} facilitiesInRange={this.state.facilitiesInRange}/> 
                </div>: 
                null 
              }
            </div>
          </div>
        
        
    )
  }
}