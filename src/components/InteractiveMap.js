import React from "react";
import MAPBOXGL, {FlyToInterpolator} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';


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
      mapStyle: "mapbox://styles/mapbox/streets-v9",
      xy: []
    };
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

    // this will use the API if not in developement mod
    let targetUrl = 'https://api.lodestarhealthdata.com/api/Facility?latitude=55.5&longitude=45.4';
    
    // handling production vs development in a simple way
    console.log(window.location.href)
    
    if (window.location.href === "http://localhost:3000/") {
      targetUrl = "http://localhost:5000/api/Facility/?latitude=55.5&longitude=45.5";
    } 
    
    fetch (targetUrl)
        .then(result =>(result.json())) // convert to json
        .then(data => {
            
            const _long = data[0].long;
            const _lat = data[0].lat;
            
            this.setState({
                xy: [_long, _lat]
            });

            this._goToViewport(_long,_lat)
        });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position =>
        console.log(position)
      );
    } else {
      console.log("nope");
    }
  }

  _goToViewport = (longitude, latitude) => {
    this._onChangeViewport({
      longitude,
      latitude,
      zoom: 8,
      transitionInterpolator: new FlyToInterpolator(),
      transitionDuration: 1000
    });
  };

  _recenter = coordinates => {
    const { latitude, longitude } = coordinates;
    const newViewport = { latitude, longitude };
    const viewport = Object.assign({}, this.state.viewport, newViewport);
    this.setState({ viewport });
  };


  _getBounds = () => {
    const rawBounds = this.map._getMap().getBounds();
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

  render() {
    const { mapStyle, viewport } = this.state;

    return (

      <MAPBOXGL
        mapboxApiAccessToken={MAPBOXGL.accessToken}
        onViewportChange={this._onChangeViewport}
        mapStyle={mapStyle}
        ref={map => (this.map = map)}
        {...viewport}
      >
      <div className="inline-block absolute top left mt12 ml12 bg-darken75 color-white z1 py6 px12 round-full txt-s txt-bold">
          <div>{`Longitude: ${viewport.longitude.toFixed(4)} Latitude: ${viewport.latitude.toFixed(4)} Zoom: ${viewport.zoom.toFixed(2)}`}</div>
        </div>
        {/* {this.state.xy.filter(this._withinBounds).map((xy, i) => {
          return (
            <Marker
              xy={{ x: xy.lat, y: xy.lon }}
              color={getRgbForValue(xy.secsSinceReport)}
              key={i}
              text={xy.routeId}
            />
          );
        })} */}
        {/* <Info />
        <Legend /> */}
      </MAPBOXGL>
    );
  }
}

export default InteractiveMap;