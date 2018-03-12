import React from 'react';
import {XYPlot, 
        XAxis,
        YAxis,
        MarkSeries,
        VerticalGridLines,
        HorizontalGridLines,
        HorizontalBarSeries,
        VerticalBarSeries,
        HorizontalBarSeriesCanvas
    } from 'react-vis';
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

    generateData = () => {
        //overall_Hospital_Linear_Mean_Score
        return this.props.facilitiesInRange.map((f,idx) => {
            return {x: f.facility_Name.substring(0,15), y: f.overall_Hospital_Linear_Mean_Score, color: idx}
        })
    }
    
    renderNearbyLocationNames = () => {

        if (this.props.facilitiesInRange === undefined || 
            this.props.facilitiesInRange === null) {
            return;
        }

        return (
            <div>
            <h1>Nearby Locations</h1>
            <ul>
            {this.props.facilitiesInRange.map((f) => 
                f.facilityId === this.props.facility.facilityId ? null : <li key={`neaby-${f.facilityId}`}>{f.facility_Name}</li>
             )}
             </ul>
             </div>
             
        )
    }

    barChart = () => {
       return (
        <div>
            <h2>Overall Hospital Linear Mean Score</h2>
            <XYPlot
            xType="ordinal"
            width={300}
            height={300}
            xDistance={100}
            >
            <VerticalGridLines />
            <HorizontalGridLines />
            <XAxis />
            <YAxis />
            <VerticalBarSeries 
                className="vertical-bar-series-example"
                data={this.generateData()}/>
            </XYPlot>
        </div>
       );
    }

    render() {
        
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
                { this.renderNearbyLocationNames() }
                { this.barChart() }
                </div>
                )
        }
    }

}
export default FacilitySidebar;