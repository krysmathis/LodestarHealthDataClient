import React from "react";
import '../../node_modules/animate.css';


class FilterBox extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            filterText: '',
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

    exitFilter = () => {
        this.setState({filterText: ''})
    }

    clearText = (evt) => {
        evt.target.value = '';
    }       

    submitFilter = (evt) => {

        // get the lat and long from the facility based on the id
        const facility = this.props.facilities.find(f => f.facilityId === parseInt(evt.target.id,0))
        this.exitFilter();
        this.renderListOfOptions();
        evt.target.value = null;
        this.props.onSubmit(facility)

        return;
    }

    renderListOfOptions() {
        
        if (this.props.facilities === null || 
            this.state.filterText === null ||
            this.state.filterText === ''
        ) {
            return
        }
        const filteredResults = this.props.facilities.filter(f => f.facility_Name.toLowerCase().includes(this.state.filterText.toLowerCase()));
        const listOfFacilitiesThatContainSubstring = filteredResults.map((f) => 
            <li key={f.facilityId} onClick={this.submitFilter} id={f.facilityId}>{f.facility_Name}</li>
        );
        return (listOfFacilitiesThatContainSubstring);
    }

    render() {
        return (
            <div >
        <div className='flex-parent'>
            <input className='input border-r--0 round-l' type="text" onChange={this.handleInputChange} onFocus={this.clearText} value={this.state.filterText} placeholder="Search facilities"/>
            <button className='btn px24 round-r' onClick={this.exitFilter}>Clear</button>
        </div>
                <ul id="facility__list">{this.renderListOfOptions()}</ul>
            </div>
        )

    }

}

export default FilterBox;