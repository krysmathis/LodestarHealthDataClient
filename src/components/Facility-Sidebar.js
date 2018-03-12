import React from 'react';
import {XYPlot, MarkSeries} from 'react-vis';
import '../../node_modules/react-vis/dist/style.css';

const styles = {
    box: {
      backgroundColor: 'white',
      margin: 0,
      padding: 10,
      width: '100%',
      zIndex: 100,
    },
    another: {
      backgroundColor: 'red'
    }
  }
  

class FacilitySidebar extends React.Component {

    
    renderNearbyLocationNames = () => {

        if (this.props.facilitiesInRange === undefined || 
            this.props.facilitiesInRange === null) {
            return;
        }

        return (
            <ul>
            <h3>Nearby Locations</h3>
            {this.props.facilitiesInRange.map((f) => 
                <li key={`neaby-${f.facilityId}`}>{f.facility_Name}</li>
             )}
             </ul>
             
        )
    }

    render() {

        const myData = [
            {x: 1, y: 10, size: Math.floor(Math.random() * 20)},
            {x: 1.7, y: 12, size: 10},
            {x: 2, y: 5, size: 1},
            {x: 3, y: 15, size: 12},
            {x: 2.5, y: 7, size: 4}
        ];
        
        const header = (<div>
                            <p>This section could display the detail</p>
                            <p>The app would hide this section when no info is selected</p>
                        </div>)

        if (this.props.facility === null) {
            return <div>{header}</div>
        } else {
            return  (
                <div>
                <div>{this.props.facility.system_Affiliation_Name}</div>
                { this.renderNearbyLocationNames()}
                <XYPlot style={{...styles.box}}
                width={200}
                height={200}>
                <MarkSeries
                    className="mark-series-example"
                    sizeRange={[5, 15]}
                    data={myData}/>
                </XYPlot>
                </div>
                )
        }
    }

}
export default FacilitySidebar;