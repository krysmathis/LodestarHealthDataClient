import React from 'react';


import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  LineMarkSeries,
  LineSeries
} from 'react-vis';
import '../../../node_modules/react-vis/dist/style.css';

export default class PerformanceChart extends React.Component {
    render() {
        return (
          <XYPlot
            width={300}
            height={300}>
            <VerticalGridLines />
            <HorizontalGridLines />
            <XAxis />
            <YAxis />
            <LineMarkSeries
              className="linemark-series-example"
              style={{
                stroke: 'white'
              }}
              data={[

                {x: 1.5, y: 29},

              ]}/>
            <LineSeries
              className="linemark-series-example-2"
              curve={'curveMonotoneX'}
              data={[
                {x: 1, y: 11},
                {x: 1.5, y: 29},
                {x: 3, y: 7}
              ]}/>
          </XYPlot>
        );
      }    
}