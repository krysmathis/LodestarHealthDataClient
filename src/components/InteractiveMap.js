import React from "react";
import MAPBOXGL, {Popup, Marker, FlyToInterpolator, NavigationControl as navigator} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import FacilityPin from './Facility-Pin';
import FacilityInfo from './Facility-Info';
import FilterBox from './Filter-Box';
import './InteractiveMap.css';
import distance from '../DistanceCalc';

// import {fromJS} from '../../node_modules/immutable/dist/immutable'

MAPBOXGL.accessToken = 'pk.eyJ1Ijoia3J5c21hdGhpcyIsImEiOiJjamUyc3RmZ3owbHFjMnhycTdjeDlsNzZ5In0.D1mdaVwx9hmI47dZd0cvRQ';

class InteractiveMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        latitude: 36.6536025,
        longitude: -86.4004877,
        zoom: 8,
        width: this.props.width,
        height: this.props.height,
        startDragLngLat: null,
        isDragging: null
      },
      mapStyle: "mapbox://styles/krysmathis/cjeimaj4r1k6w2rqeflmdfwc8",
      xy: [],
      facilities: [],
      facilityAvg: {},
      facilitiesInRange: [],
      popupInfo: null,
      apiUrl: 'https://api.lodestarhealthdata.com/api/Facility',
      token: null
    };

    
    this._renderFacilityMarker = this._renderFacilityMarker.bind(this);
    this._goToViewport = this._goToViewport.bind(this);
    this.getSavedToken = this.getSavedToken.bind(this);
  }

 

  // added the map will not properly resize without it, it will 'stick' in the first setting
  componentWillReceiveProps(nextProps) {
    const viewPort = this.state.viewport;
    viewPort.width = nextProps.width;
    viewPort.height = nextProps.height;
    this.setState({
        viewport: viewPort
    });
  }

  

  componentDidMount() {

    this.getFacilities(); 

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position =>
        console.log("navigator position ", position)
      );
    } else {
      console.log("nope");
    }
          
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
        //targetUrl = "http://localhost:5000/api/Facility";
    } 
    
    fetch (targetUrl, {
      method: 'GET',
      mode: 'cors',
      // headers: {
      //   'Authorization': 'Bearer ' + this.getSavedToken()
      // }
    }).then(result =>{
      if(result.ok) {
        return result.json();
      }
    }) // convert to json
    .then(data => {
      if(data) {
        
            const _long = data[0].long;
            const _lat = data[0].lat;
            
            this.setState({
                xy: [_long, _lat],
                facilities: data
            });
            console.log(data);
            this._goToViewport(_long,_lat, 8.5)
          }
        });
  }

  _goToViewport = (longitude, latitude, zoom) => {
    this._onChangeViewport({
      longitude,
      latitude,
      zoom: zoom,
      transitionInterpolator: new FlyToInterpolator(),
      transitionDuration: 500
    });
  };

  _searchFormSubmit = (facility) => {

    this._goToViewport(
      facility.long, 
      facility.lat,
      this.state.viewport.zoom < 8.5 ? 8.5 : this.state.viewport.zoom
    )

    setTimeout(() => this._initializePopupData(facility),100);
    
  };

  _getBounds = () => {
    const rawBounds = this.mapRef.getMap().getBounds();
    const bounds = {
      lat: {
        high: rawBounds._ne.lat,
        low: rawBounds._sw.lat
      },
      lon: {
        high: rawBounds._ne.lng,
        low: rawBounds._sw.lng
      }
    };
    return bounds;
  };

  _withinBounds = latLon => {
    return (
      latLon.lat >= this._getBounds().lat.low &&
      latLon.lat <= this._getBounds().lat.high &&
      latLon.lon >= this._getBounds().lon.low &&
      latLon.lon <= this._getBounds().lon.high
    );
  };

  
  _onChangeViewport = newViewport => {
    
    const viewport = Object.assign({}, this.state.viewport, newViewport);
    this.setState({ viewport });
    
  };


  _renderFacilityMarker = (facility, index) => {
    const zoomChangeAt = 8.5;
    // do not render if there is nothing to render  
    if (facility.length === 0) {
      return; 
    }

    const system = facility.system_Affiliation_Name;
    // could control the color and size from here as each Marker is a one
    // to one representation of a facility
    let color = "black"
    let markerSize = 20;
    system === "HCA" ? markerSize = (markerSize * 2) : markerSize = 20;
    if (this.state.viewport.zoom < zoomChangeAt) {
      markerSize = 5;

      if (  system !== "HCA") {
        return;
      }
    }
    // if the system is HCA show up as blue otherwise as red
    system === "HCA" ? color = "#030F42" : color = "red";

    // TODO: rules on the size of the marker
    return (
      <Marker key={`marker-${index}`}
        longitude={facility.long}
        latitude={facility.lat} 
        >
        <FacilityPin  size={markerSize} 
                      color={color} 
                      opacity={.75}
                      onClick={
                        () => {
                          this._initializePopupData(facility);
                          // now center the map on the clicked location
                          setTimeout(() => this._goToViewport(
                              facility.long, 
                              facility.lat,
                              this.state.viewport.zoom < 8.5 ? 8.5 : this.state.viewport.zoom)
                            ,100);
                        }} />
      </Marker>
    );
  }

  _initializePopupData = (facility) => {
    
    // this is where we could publish data into the sidebar
    // collect the nearby facilities
    let nearby = this.state.facilities.filter(f => distance(
      facility.lat,
      facility.long,
      f.lat,
      f.long,
      "N"
    ) < 50 );
    
    this.setState({popupInfo: facility});
    this.props.publishDetails(facility, nearby);
    
    console.log("nearby: ", nearby);

}


  _renderPopup() {

    const {popupInfo} = this.state;

    return popupInfo && (
      <Popup tipSize={20}
        anchor="top"
        longitude={popupInfo.long}
        latitude={popupInfo.lat}
        onClose={() => {
          this.setState({popupInfo: null})
          this.props.publishDetails(null)
          }} >
        <FacilityInfo info={popupInfo} />
      </Popup>
    );
  }

  render() {
    const { mapStyle, viewport } = this.state;

    return (

      <MAPBOXGL
        mapboxApiAccessToken={MAPBOXGL.accessToken}
        onViewportChange={this._onChangeViewport}
        mapStyle={mapStyle}
        ref={map => (this.mapRef = map)}
        {...viewport}
        >
    
        <div className="filterBox">
          <div>Search by Facility Name</div>
          <FilterBox facilities={this.state.facilities} onSubmit={this._searchFormSubmit}/>
        </div>
      <div className="locationBlock">
          <div>{`Longitude: ${viewport.longitude.toFixed(4)} Latitude: ${viewport.latitude.toFixed(4)} Zoom: ${viewport.zoom.toFixed(2)}`}</div>
        </div>
          {this.state.facilities.map(this._renderFacilityMarker)}
          {this._renderPopup()}
        {/* <Info />
        <Legend /> */}  
      </MAPBOXGL>
    );
  }
}

export default InteractiveMap;