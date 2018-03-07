import React, {PureComponent} from 'react';

const styles = {
  box: {
    backgroundColor: 'blue',
    margin: 0,
    padding: 10,
    width: '100%'
  },
  another: {
    backgroundColor: 'red'
  }

}

export default class FacilityInfo extends PureComponent {

  render() {
    const {info} = this.props;
    const displayName = `${info.facility_Name}, ${info.system_Affiliation_Name}`;

    return (
      <div >
        <div style={{...styles.box}}>
          {displayName} 
        </div>
          {/* <img width={240} src={info.image} alt="location marker"/> */}
      </div>
    );
  }
}