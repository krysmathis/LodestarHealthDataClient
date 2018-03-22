import React from 'react';
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
        // setTimeout(this.props.closeSidebar(),1500);
    }
    
    renderNearbyLocationNames = () => {

        if (this.props.facilitiesInRange === undefined || 
            this.props.facilitiesInRange === null ||
            this.props.facilitiesInRange.length === 1) {
            return;
        }

        return (
            <div>
            <h1>Overlapping Locations</h1>
            <ul className="nearbyLocations__ul">
            {this.props.facilitiesInRange.sort((a,b) => a.distance - b.distance).map((f) => 
                f.facilityId === this.props.facility.facilityId ? null : <li onClick={this.publishFacility} className="nearbyLocations__li" key={`nearby-${f.facilityId}`} id={`nearby-${f.facilityId}`}><div className="nearbyLocations__name">{f.facility_Name}</div></li>
            )}
             </ul>
             </div>
             
        )
    }

   
    render() {

        if (this.props.facility === null) {
            return;
        } else {
            return  (
                <div >
                    <div className='facility__sidebar'>
                        <div className='flex-parent flex-parent--column'>
                            <div className='px8 py8 scroll-auto'>
                                { this.renderNearbyLocationNames() }
                            </div>
                        </div>
                        <div className='flex-parent flex-parent--column  overlapping__footer round-b-ml txt-s'>
                            <div onClick={this.props.closeSidebar} className="overlapping__btn-dismiss flex-parent flex-parent--row flex-parent--center-main btn btn--black round"><svg className='icon h36 w36'><use xlinkHref='#icon-close'/></svg><span>Dismiss</span></div>
                        </div>
                    </div>
                </div>

                )
        }
    }

}
export default FacilitySidebar;