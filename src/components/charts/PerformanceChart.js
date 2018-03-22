import React from 'react';
import {histogram}from 'd3-array';

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

const styles = {
  width: 300,
  margin: 0
}

/*
  props: 
    data = an array of just the datapoints that go into the map
    threshold = the number of bins
*/
export default class PerformanceChart extends React.Component {

    generateHistogram = () => {

        const data = this.props.data;
        const threshold = this.props.threshold;
        const facility = this.props.facility;
        
        const intervals = [Math.min(...data), Math.max(...data)]

        const getBins = histogram()
        .domain(intervals)    // Set the domain to cover the entire interval
        .thresholds(threshold)
        
        const bins = getBins(data);

        let target = {}
        // convert the bins into something the map can use
        const dataSet = bins.map(b => {
          const binObj = {x: b.x0, y: b.length}
          if (facility >= b.x0 && facility < b.x1) {
            target = binObj;
          }
          return binObj;
        })
        
        // target is an {x: , y: } representing where the facility fits
        return {data: dataSet, target: target }
    }

    
    render() {
        
      const {data, target} = this.generateHistogram();
      const title = this.props.title;


        return (
          <div style={{...styles}}>
            <h3>{title}</h3>
          <XYPlot
            width={300}
            height={300}>
            <VerticalGridLines />
            <HorizontalGridLines />
            <XAxis />
            <YAxis title='Number of Facilities'/>
            <LineMarkSeries
              className="linemark-series-example"
              style={{
                stroke: 'white'
              }}
              data={[
                target
              ]}/>
            <LineSeries
              className="linemark-series-example-2"
              curve={'curveMonotoneX'}
              data={data}/>
          </XYPlot>
          </div>
        );
      }    
}