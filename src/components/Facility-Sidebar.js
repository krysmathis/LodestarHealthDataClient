import React from 'react';
import {XYPlot, 
        XAxis,
        YAxis,
        VerticalGridLines,
        HorizontalGridLines,
        VerticalBarSeries,
    } from 'react-vis';
import '../../node_modules/react-vis/dist/style.css';
  
/*
    The facility sidebar will show nearby locations to allow the 
    user the ability to select facilities even if they overlap
    other, more visible locations
*/
class FacilitySidebar extends React.Component {

    generateData = () => {
        //overall_Hospital_Linear_Mean_Score
        return this.props.facilitiesInRange.map((f,idx) => {
            return {x: f.facility_Name.substring(0,15), y: f.overall_Hospital_Linear_Mean_Score, color: idx}
        })
    }

    publishFacility = (evt) => {
        const id = parseInt(evt.target.parentNode.id.split('nearby-')[1],0);
        this.props.onClick(id);
    }
    
    renderNearbyLocationNames = () => {

        if (this.props.facilitiesInRange === undefined || 
            this.props.facilitiesInRange === null) {
            return;
        }

        return (
            <div>
            <h1>Nearby Locations</h1>
            <ul className="nearbyLocations__ul">
            {this.props.facilitiesInRange.sort((a,b) => a.distance - b.distance).map((f) => 
                f.facilityId === this.props.facility.facilityId ? null : <li onClick={this.publishFacility} className="nearbyLocations__li" key={`nearby-${f.facilityId}`} id={`nearby-${f.facilityId}`}><div className="nearbyLocations__name">{f.facility_Name}</div> <div>{f.distance}</div></li>
            )}
             </ul>
             </div>
             
        )
    }

    /*
        The bar chart is optional at this point
        TODO: move this to the other object
    */
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
                    <div class='absolute top-ml left bottom z1 w-full w240-ml px12 py12-ml'>
                        <div class='flex-parent flex-parent--column viewport-third h-auto-ml hmax-full bg-white round-ml shadow-darken10'>
                        <div class='px12 py12 scroll-auto'>
                            <h3 class='txt-m txt-bold mb8'>{this.props.facility.system_Affiliation_Name}</h3>
                            { this.renderNearbyLocationNames() }
                        </div>
                        <footer class='px12 py12 bg-gray-faint round-b-ml txt-s'>
                            Footer content here
                        </footer>
                        </div>
                    </div>

               
                </div>
                )
        }
    }

}
export default FacilitySidebar;