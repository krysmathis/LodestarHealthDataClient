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
    width: '100%',
    zIndex: 100,
  },
  another: {
    backgroundColor: 'red'
  },
  info__h2: {
    fontWeight: 800
  }
  
}

export default class FacilityInfo extends PureComponent {

  render() {
    const {info} = this.props;
    const displayName = `${info.facility_Name}`;

    return (
      <div style={{...styles.box}}>
        <h2 className="info__h2">
          {displayName} 
        </h2>
        
        <InformationTable facility={info}/>
        <QualityTable facility={info}/>
        <MarketTable facility={info}/>
        <FinanceTable facility={info}/>
        <button className="btn btn-primary">Make Home Location</button>
      </div>
    );
  }
}