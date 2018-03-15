import React from "react";
import MAPBOXGL, {Popup, Marker, FlyToInterpolator} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import FacilityPin from './Facility-Pin';
import FacilityInfo from './Facility-Info';
import './InteractiveMap.css';
import distance from '../utils/DistanceCalc';

MAPBOXGL.accessToken = 'pk.eyJ1Ijoia3J5c21hdGhpcyIsImEiOiJjamUyc3RmZ3owbHFjMnhycTdjeDlsNzZ5In0.D1mdaVwx9hmI47dZd0cvRQ';

// default level of zoom for the map
const defaultZoom = 8.5;
const baseMarkerSize = 20;

class InteractiveMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        latitude: 36.6536025,
        longitude: -86.4004877,
        zoom: 8.5,
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
      this.state.viewport.zoom < defaultZoom ? defaultZoom : this.state.viewport.zoom
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

  _withinBounds = facility => {
    return (
      facility.lat >= this._getBounds().lat.low &&
      facility.lat <= this._getBounds().lat.high &&
      facility.long >= this._getBounds().lon.low &&
      facility.long <= this._getBounds().lon.high
    );
  };

  
  _onChangeViewport = newViewport => {
    
    const viewport = Object.assign({}, this.state.viewport, newViewport);
    this.setState({ viewport });
    
  };


  _renderFacilityMarker = (facility, index) => {
    
    // do not render if there is nothing to render  
    if (facility.length === 0) {
      return; 
    }
    
    // capture the system as this is a trigger point
    const system = facility.system_Affiliation_Name;
    
    /* 
    marker size is dynamic based on a calculation and depends on
    if the facility is an HCA facility or not
    */
   let markerSize = facility.cY_Discharges/this.props.avgMarkerSize * baseMarkerSize;
   if(system === "HCA") {
      markerSize = (markerSize * 2)
   } 
   
   /*
   When zoomed out, do two things: 
   1. Shrink the marker size so the user can view all markers
   2. Only show HCA Hospitals
   */
  const zoomChangeAt = defaultZoom;
  if (this.state.viewport.zoom < zoomChangeAt) {
    markerSize = 5;
    
    if (  system !== "HCA") {
      return;
    }
  }
  
    // could control the color and size from here as each Marker is a one
    // to one representation of a facility
    // if the system is HCA show up as blue otherwise as red
    let color = "black"
    system === "HCA" ? color = "#030F42" : color = "red";


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
                              this.state.viewport.zoom < defaultZoom ? defaultZoom : this.state.viewport.zoom)
                            ,200);
                        }} />
      </Marker>
    );
  }

  _initializePopupData = (facility) => {
    
    // this is where we could publish data into the sidebar
    // collect the nearby facilities
    let nearby = this.props.facilities.filter(f => distance(
      facility.lat,
      facility.long,
      f.lat,
      f.long,
      "N"
    ) < 5 );
    
    this.setState({popupInfo: facility});
    this.props.publishDetails(facility, nearby);
    

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
        <FacilityInfo info={popupInfo} setHomeLocation={this.props.setHomeLocation}/>
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
     
      <div className="locationBlock">
          <div>{`Longitude: ${viewport.longitude.toFixed(4)} Latitude: ${viewport.latitude.toFixed(4)} Zoom: ${viewport.zoom.toFixed(2)}`}</div>
        </div>
          {this.props.facilities.filter(f=> this._withinBounds(f)).map(this._renderFacilityMarker)}
          {this._renderPopup()}
        {/* <Info />
        <Legend /> */}  
      </MAPBOXGL>
    );
  }
}

export default InteractiveMap;