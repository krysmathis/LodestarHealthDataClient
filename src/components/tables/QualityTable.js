import React from 'react';

export default class QualityTable extends React.Component {
    
    render() {
        
        const {overall_Hospital_Linear_Mean_Score, 
            quality_Complications_Deaths, 
            quality_Hosp_Acq_Infections, 
            quality_Readmissions
            } = this.props.facility

    
    return (
    <table className="data__table">
    <thead>
    <tr>
        <th>Quality</th>
        <th></th> 
    </tr>
    </thead>
    <tbody>
    <tr>
        <td className="column__name">Overall Score</td>
        <td>{overall_Hospital_Linear_Mean_Score}</td> 
    </tr>
    <tr>
        <td>Complications And Deaths</td>
        <td>{quality_Complications_Deaths}</td> 
    </tr>
    <tr>
        <td>Hospital Acq Infections</td>
        <td>{quality_Hosp_Acq_Infections}</td> 
    </tr>
    <tr>
        <td>Readmissions</td>
        <td>{quality_Readmissions}</td> 
    </tr>
    </tbody>
    </table>
    )

    }
}