import React, {PureComponent} from 'react';

const styles = {
  box: {
    backgroundColor: 'white',
    margin: 0,
    padding: 10,
    width: '100%',
    zIndex: 100,
  },
  another: {
    backgroundColor: 'red'
  }

}

export default class FacilityInfo extends PureComponent {

  render() {
    const {info} = this.props;
    const displayName = `${info.facility_Name}`;

    return (
      <div style={{...styles.box}}>
        <div >
          {displayName} 
        </div>
        <div>
          Affiliation: {info.system_Affiliation_Name}
        </div>
          {/* <img width={240} src={info.image} alt="location marker"/> */}
      </div>
    );
  }
}