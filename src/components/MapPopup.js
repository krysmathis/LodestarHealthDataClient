import React from 'react';
import {Popup} from 'react-map-gl';

class MapPopup extends React.Component {
    
      render() {
        const {facility} = this.props;
        
        console.log("facility", facility)
        
        return (
            <Popup
            latitude={facility.lat}
            longitude={facility.long}
            anchor="bottom"
            offset={[0, -15]}>
            <div >
                <h1 >Hello! World</h1>
            </div>
            </Popup>
        )
    };
}
  
  export default MapPopup;