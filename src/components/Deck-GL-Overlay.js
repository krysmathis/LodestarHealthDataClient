import React, {Component} from 'react';

import DeckGL, {ScatterplotLayer} from 'deck.gl';

export default class DeckGLOverlay extends Component {


  render() {
    const {viewport, data, maleColor, femaleColor, radius} = this.props;

    if (!data) {
      return null;
    }

    const layer = new ScatterplotLayer({
      id: 'scatter-plot',
      data,
      radiusScale: radius,
      radiusMinPixels: 0.25,
      getPosition: d => [d[0], d[1], 0],
      getColor: d => (d[4] === 'HCA' ? maleColor : femaleColor),
      getRadius: d =>d[2]*.05,
      opacity: 0.5,
      updateTriggers: {
        getColor: [maleColor, femaleColor]
      }
    });

    return <DeckGL {...viewport} layers={[layer]} />;
  }
}
