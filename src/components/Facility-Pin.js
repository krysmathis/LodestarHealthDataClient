import React, {PureComponent} from 'react';
import './Tooltip.css';

const pinStyle = {
  cursor: 'pointer',


};

// the facility pin will determine the size and color of the marker
export default class FacilityPin extends PureComponent {
  
  
  render() {
    const {size, color, onClick, opacity, selected} = this.props;
    return (
      <div className='tooltip'>
          <svg height={size*2} width={size*2}
              style={{...pinStyle, transform: `translate(${-size/1}px,${-size}px)`}}
              onClick={onClick} >
              {!selected ? <circle  cx={size} cy={size} r={size/2} stroke={color} strokeWidth="10" fill={color} opacity={opacity} /> : 
              <circle className="selected__marker"  cx={size} cy={size} r={size/2} stroke={'black'} strokeWidth="10" fill={'black'} opacity={1} />}
          </svg>
         <span className='tooltiptext' onClick={onClick}>{this.props.name}</span>
      </div>
    );
  }
}