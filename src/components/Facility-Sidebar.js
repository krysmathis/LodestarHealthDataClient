import React from 'react';

class FacilitySidebar extends React.Component {

    render() {
        
        const header = (<div>
                            <p>This section could display the detail</p>
                            <p>The app would hide this section when no info is selected</p>
                        </div>)

        if (this.props.facility === null) {
            return <div>{header}</div>
        } else {
            return <div>{this.props.facility.system_Affiliation_Name}</div>
        }
    }

}
export default FacilitySidebar;