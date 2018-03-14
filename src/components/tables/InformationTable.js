import React from 'react';

const style = {
    table: {
        textAlign: 'left',
        width: '100%'
    }
}

export default class InformationTable extends React.Component {
    
    render() {
        
        const {
            system_Affiliation_Name,
            overall_Hospital_Linear_Mean_Score,
            likelihood_To_Recommend, 
            
            } = this.props.facility

        console.log(this.props.facility)
        return (
        <table className="data__table">
        <thead>
        <tr>
            <th>General Information</th>
            <th>Value</th> 
        </tr>
        </thead>
        <tbody>
        <tr>
            <td className="column__name">System Affiliation</td>
            <td>{system_Affiliation_Name}</td> 
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