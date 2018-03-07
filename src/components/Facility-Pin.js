import React, {PureComponent} from 'react';


const pinStyle = {
  cursor: 'pointer',


};

export default class FacilityPin extends PureComponent {

  render() {
    const {size = 20, color, onClick} = this.props;

    return (
     
      <svg height={size*2} width={size*2}
        style={{...pinStyle, transform: `translate(${-size/1}px,${-size}px)`}}
        onClick={onClick} >
        <circle cx={size} cy={size} r={size/2} stroke={color} strokeWidth="5" fill={color} opacity="0.75" />

      </svg>
    );
  }
}