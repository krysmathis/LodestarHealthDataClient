import React from 'react';
import numberWithCommas from '../../utils/NumbersWithCommas';



export default class MarketTable extends React.Component {
    
    render() {
        
        const {current_Year_Commercial_Market_Share, 
            current_Year_Market_Share, 
            household_Income, 
            total_2017_22_Pop_Growth
            } = this.props.facility

        
        return (
        <table className="data__table">
        <thead>
        <tr>
            <th className="column__name">Market Information</th>
            <th></th> 
        </tr>
        </thead>
        <tbody>
        <tr>
            <td className="column__name">CY Commercial Market Share</td>
            <td className="center">{(current_Year_Commercial_Market_Share * 100).toFixed(1) + "%"}</td> 
        </tr>
        <tr>
            <td>CY Market Share</td>
            <td className="center">{(current_Year_Market_Share * 100).toFixed(1) + "%"}</td> 
        </tr>
        <tr>
            <td>Household Income</td>
            <td className="center">{"$" + numberWithCommas(household_Income.toFixed(0))}</td> 
        </tr>
        <tr>
            <td>Population Growth (2017-2022)</td>
            <td className="center">{(total_2017_22_Pop_Growth * 100).toFixed(1) + "%"}</td> 
        </tr>
        </tbody>
        </table>
        )
    }
}