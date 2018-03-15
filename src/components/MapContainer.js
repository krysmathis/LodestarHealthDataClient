import React from 'react';
import './../App.css';
import './../../node_modules/animate.css'
import InteractiveMap from './InteractiveMap';
import FacilitySidebar from './Facility-Sidebar';
import Navigation from './Navigation';


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
        showSidebar: false,
        overlayClass: 'map-overlay hidden',
        apiUrl: 'https://api.lodestarhealthdata.com/api/Facility',
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
      _windowDimensions.height = window.innerHeight - 50;
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
    let targetUrl = this.state.apiUrl;
    
    // handling production vs development in a simple way    
    if (window.location.href === "http://localhost:3000/") {
        targetUrl = "http://localhost:5000/api/Facility";
    } 
    
    fetch (targetUrl, {
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
            const _long = data[0].long;
            const _lat = data[0].lat;
            
            /*
              Calculate the average marker size in order to create a scalable
              marker size
            */
            const totalMarkerSize = data
                              .filter(f => f.cY_Discharges > 0)
                              .reduce(function (acc, obj) { return acc + obj.cY_Discharges; }, 0);
            const _avgMarkerSize = totalMarkerSize/data.length;
            
          
            this.setState({
                xy: [_long, _lat],
                facilities: data,
                avgMarkerSize: _avgMarkerSize
            });
          }
        });
  }

  submitSearchRequest = (facility) => {
    console.log("search request initiated",facility);
    this.map._searchFormSubmit(facility);
  }

  render() {
    return (
      <div className="">
      <Navigation facilities={this.state.facilities} onSubmit={this.props.onSubmit} userLoggedIn={this.props.userLoggedIn} onFacilitySubmit={this.submitSearchRequest}/>
        <div>
          { <InteractiveMap
            height={this.state.windowDimensions.height}
            width={this.state.windowDimensions.width}
            publishDetails={this.displayFacilityDetails}
            facilities={this.state.facilities}
            ref={map => { this.map = map; }}
            avgMarkerSize={this.state.avgMarkerSize}
          /> }
        <div className={this.state.overlayClass}>
          { this.state.showSidebar ? <FacilitySidebar onClick={this.hideSidebar} facility={this.state.facility} facilitiesInRange={this.state.facilitiesInRange}/> : null }
        </div>
      </div>
      </div>
    )
  }
}