import React from "react";

class FilterBox extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            filterText: null,
            facility: null
        };
        this.facilityList = this.props.facilities;
        this.handleInputChange = this.handleInputChange.bind(this);
        this.submitFilter = this.submitFilter.bind(this);
    }
    
    // update the filter text whenever
    handleInputChange(evt) {
        this.setState({filterText: evt.target.value})
        this.renderListOfOptions(this.state.filterText)
    }

    submitFilter = (evt) => {

        console.log(evt.target.id)
        // get the lat and long from the facility based on the id
        const facility = this.props.facilities.find(f => f.facilityId === parseInt(evt.target.id,0))
        this.props.onSubmit(facility.long, facility.lat)
        return;
    }

    renderListOfOptions() {
        if (this.props.facilities === null || this.state.filterText === null) {
            return
        }
        const filteredResults = this.props.facilities.filter(f => f.facility_Name.toLowerCase().includes(this.state.filterText.toLowerCase()));
        const lis = filteredResults.map((f) => 
            <li key={f.facilityId} onClick={this.submitFilter} id={f.facilityId}>{f.facility_Name}</li>
        );
        return (lis);
    }

    render() {
        return (
            <div>
                <input type="text" onChange={this.handleInputChange} />
                <ul>{this.renderListOfOptions()}</ul>
            </div>
        )

    }

}

export default FilterBox;