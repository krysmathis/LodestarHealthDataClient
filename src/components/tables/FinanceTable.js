import React from 'react';
import numberWithCommas from '../../utils/NumbersWithCommas';
import './Table.css';

const style = {
    table: {
        textAlign: 'left',
        width: '100%'
    }
}

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

        console.log(this.props.facility)
        return (
        <table className="data__table">
        <thead>
        <tr>
            <th>Financial Metrics</th>
            <th>Value</th> 
        </tr>
        </thead>
        <tbody>
        <tr>
            <td className="column__name">Fund Balance</td>
            <td className="column__value">{dollarConvert(fund_Balance)}</td> 
        </tr>
        <tr>
            <td >Current Assets</td>
            <td>{dollarConvert(current_Assets)}</td> 
        </tr>
        <tr>
            <td>Current Liabilities</td>
            <td>{dollarConvert(current_Liabilities)}</td> 
        </tr>
        <tr>
            <td>Total Liabilities</td>
            <td>{dollarConvert(total_Liabilities)}</td> 
        </tr>
        <tr>
            <td>Estimated NR</td>
            <td>{dollarConvert(estimated_NR)}</td> 
        </tr>
        <tr>
            <td>Estimated CM</td>
            <td>{dollarConvert(estimated_CM)}</td> 
        </tr>
        <tr>
            <td>Estimated EBITDA</td>
            <td>{dollarConvert(estimated_EBITDA)}</td> 
        </tr>
        <tr>
            <td>Estimated EBITDAR</td>
            <td>{dollarConvert(ebitdar)}</td> 
        </tr>

        </tbody>
        </table>
        )
    }
}