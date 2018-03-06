import React, { Component } from 'react';
import './App.css';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1Ijoia3J5c21hdGhpcyIsImEiOiJjamUyc3RmZ3owbHFjMnhycTdjeDlsNzZ5In0.D1mdaVwx9hmI47dZd0cvRQ';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      lng: -86,
      lat: 34,
      zoom: 4.5
    };
  }

  componentDidMount() {

    const { lng, lat, zoom } = this.state;

    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [lng, lat],
      zoom
    });

    let targetUrl = 'https://api.lodestarhealthdata.com/api/Facility?latitude=55.5&longitude=45.4';
    
    // handling production vs development in a simple way
    console.log(window.location.href)
    
    if (window.location.href === "http://localhost:3000/") {
      targetUrl = "http://localhost:5000/api/Facility/?latitude=55.5&longitude=45.5";
    } 
    
    fetch (targetUrl)
    .then(result =>(result.json()))
    .then(data => {

      this.setState({
        lng: data[0].long,
        lat: data[0].lat,
      });

      const { lng, lat, zoom } = this.state;
      // recenter the map
      map.flyTo({center: [lng,lat]});
      console.log("data", {"url" :targetUrl, "data": data})
      //map.flyTo = ({center: [lng, lat]});
   
    });



    

    map.on('move', () => {
      const { lng, lat } = map.getCenter();

      this.setState({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: map.getZoom().toFixed(2)
      });
    });


    
  }


  
  render() {
    const { lng, lat, zoom } = this.state;

    return (
      <div>
        <div className="inline-block absolute top left mt12 ml12 bg-darken75 color-white z1 py6 px12 round-full txt-s txt-bold">
          <div>{`Longitude: ${lng} Latitude: ${lat} Zoom: ${zoom}`}</div>
        </div>
        <div ref={el => this.mapContainer = el} className="absolute top right left bottom" />
      </div>
    );
  }
}

export default App;
