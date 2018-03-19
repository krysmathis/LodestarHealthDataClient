import React, {PureComponent} from 'react';
import QualityTable from './tables/QualityTable';
import MarketTable from './tables/MarketTable';
import FinanceTable from './tables/FinanceTable';
import InformationTable from './tables/InformationTable';

const styles = {
  box: {
    backgroundColor: 'white',
    margin: 0,
    padding: 10,
    width: '90%',
    zIndex: 100,
    position: 'absolute',
    paddingRight: 30
  },
  another: {
    backgroundColor: 'red'
  },
  info__h2: {
    fontWeight: 800,
    fontSize: '1.5em'
  }
  
}

export default class FacilityInfo extends PureComponent {

  setHomeLocation = () => {
    const {info} = this.props;
    this.props.setHomeLocation(info.lat, info.long);
  }

  render() {
    const {info} = this.props;
    const displayName = `${info.facility_Name}`;

    return (
      <div>
        <div style={{...styles.box}}>
          <h2 style={{...styles.info__h2}}>
            {displayName} 
          </h2>
          
          <InformationTable facility={info}/>
          <QualityTable facility={info}/>
          <MarketTable facility={info}/>
          <FinanceTable facility={info}/>
          <button className="btn btn-primary" onClick={this.setHomeLocation}>Make Home Location</button>
        </div>
      </div>
    );
  }
}