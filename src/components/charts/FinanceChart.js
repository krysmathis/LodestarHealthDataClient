import React from 'react';
import {
    XYPlot,
    XAxis,
    YAxis,
    VerticalBarSeries,

  } from 'react-vis';
  import '../../../node_modules/react-vis/dist/style.css';


  const myDATA = [
    {x: 'This Facility', y: 10},
    {x: 'Average', y: 5},
    {x: 'Nearest HCA Facility', y: 15}
  ];
  
  const yDomain = myDATA.reduce((res, row) => {
    return {
      max: Math.max(res.max, row.y),
      min: Math.min(res.min, row.y)
    };
  }, {max: -Infinity, min: Infinity});
  

class FinanceChart extends React.Component {
    render() {

        console.log(yDomain)
        const BarSeries = VerticalBarSeries;
        return (
          <div>
            <XYPlot
            xType="ordinal"
              width={300}
              height={300}
              yDomain={[0, yDomain.max]}
              >
              <BarSeries
                className="vertical-bar-series-example"
                data={myDATA}/>
              <XAxis />
              <YAxis />
            </XYPlot>
          </div>
        );
      }
}

export default FinanceChart