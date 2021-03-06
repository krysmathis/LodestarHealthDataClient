import React from 'react';
import './Table.css';

const dollarConvert = (num) => "$"  + (num/1000000).toFixed(1) + " MM";

export default class FinanceTable extends React.Component {
    
    render() {
        
        const { current_Assets,
                current_Liabilities,
                ebitdar,
                estimated_CM,
                estimated_EBITDA,
                estimated_NR,
                fund_Balance,
                total_Liabilities
            } = this.props.facility

        return (
        <table className="data__table">
        <thead>
        <tr>
            <th>Financial Metrics</th>
            <th></th> 
        </tr>
        </thead>
        <tbody>
        <tr>
            <td className="column__name">Fund Balance</td>
            <td className="center">{dollarConvert(fund_Balance)}</td> 
        </tr>
        <tr>
            <td >Current Assets</td>
            <td className="center">{dollarConvert(current_Assets)}</td> 
        </tr>
        <tr>
            <td>Current Liabilities</td>
            <td className="center">{dollarConvert(current_Liabilities)}</td> 
        </tr>
        <tr>
            <td>Total Liabilities</td>
            <td className="center">{dollarConvert(total_Liabilities)}</td> 
        </tr>
        <tr>
            <td>Estimated NR</td>
            <td className="center">{dollarConvert(estimated_NR)}</td> 
        </tr>
        <tr>
            <td>Estimated CM</td>
            <td className="center">{dollarConvert(estimated_CM)}</td> 
        </tr>
        <tr>
            <td>Estimated EBITDA</td>
            <td className="center">{dollarConvert(estimated_EBITDA)}</td> 
        </tr>
        <tr>
            <td>Estimated EBITDAR</td>
            <td className="center">{dollarConvert(ebitdar)}</td> 
        </tr>

        </tbody>
        </table>
        )
    }
}