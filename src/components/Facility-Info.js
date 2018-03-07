import React, {PureComponent} from 'react';

export default class FacilityInfo extends PureComponent {

  render() {
    const {info} = this.props;
    const displayName = `${info.facility_Name}, ${info.system_Affiliation_Name}`;

    return (
      <div>
        <div>
          {displayName} 
        </div>
          {/* <img width={240} src={info.image} alt="location marker"/> */}
      </div>
    );
  }
}