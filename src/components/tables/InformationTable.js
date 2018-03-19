import React from 'react';
import DollarConvert from '../../utils/DollarConvert';
import numberWithCommas from '../../utils/NumbersWithCommas';
export default class InformationTable extends React.Component {
    
    render() {
        
        const {
            system_Affiliation_Name,
            likelihood_To_Recommend, 
            cY_Discharges,
            
            } = this.props.facility

        return (
        <table className="data__table">
        <thead>
        <tr>
            <th>General Information</th>
            <th></th> 
        </tr>
        </thead>
        <tbody>
        <tr>
            <td className="column__name">System Affiliation</td>
            <td>{system_Affiliation_Name}</td> 
        </tr>

        <tr>
            <td>CY Discharges</td>
            <td>{numberWithCommas(cY_Discharges)}</td> 
        </tr>
        <tr>
            <td>Likelihood To Recommend</td>
            <td>{likelihood_To_Recommend}</td> 
        </tr>
        </tbody>
        </table>
        )
    }
}