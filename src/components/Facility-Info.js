import React, {PureComponent} from 'react';
import QualityTable from './tables/QualityTable';
import MarketTable from './tables/MarketTable';
import FinanceTable from './tables/FinanceTable';
import InformationTable from './tables/InformationTable';
import FinanceChart from './charts/FinanceChart';

import Tabs from './Tabs';
import './Facility-Info.css';

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

const Tab = (props) => {

  return (
      <li className={`tab ${props.isActive ? 'active' : ''}`}
            onClick={(event) => {
              event.preventDefault();
              props.onClick(props.tabIndex);
          }
        }>       
        {/* <svg className='icon h12 w12'><use xlinkHref={props.iconClassName}/></svg> */}
              <i className={`tab-icon ${props.iconClassName}`}/>
              {props.label}
      </li>
  )
}

export default class FacilityInfo extends PureComponent {


  closeFacilityInfo = () => {
    this.props.handleClose(null);
  }

  setHomeLocation = () => {
    const {info} = this.props;
    this.props.setHomeLocation(info.lat, info.long);
  }

  render() {
    const {info} = this.props;
    const displayName = `${info.facility_Name}`;

    return (
      <div>
        <div>
        <div style={{...styles.box}}>
          <header className='info__header px8 py8 bg-gray-faint round-b-ml txt-s'>
            <button onClick={this.setHomeLocation}><svg className='icon h24 w24'><use xlinkHref='#icon-home'/></svg></button>
            <button onClick={this.closeFacilityInfo}><svg className='icon h24 w24'><use xlinkHref='#icon-close'/></svg></button>
          </header>
          <h2 style={{...styles.info__h2}}>
            {displayName} 
          </h2>
          <Tabs defaultActiveTabIndex={0} className='tabs__nav'>
              <Tab iconClassName={'icon-class-1'} linkClassName={'link-class-0'} label={'All'}>
                <InformationTable facility={info}/>
                <QualityTable facility={info}/>
                <MarketTable facility={info}/>
                <FinanceTable facility={info}/>
              </Tab>
              <Tab iconClassName={'icon-class-1'} linkClassName={'link-class-1'} label={'Quality'}>
                <QualityTable facility={info}/>
              </Tab>
              <Tab iconClassName={'icon-class-1'} linkClassName={'link-class-1'} label={'Market'}>
                <MarketTable facility={info}/>
              </Tab>
              <Tab iconClassName={'icon-class-1'} linkClassName={'link-class-1'} label={'Finance'}>
                <FinanceTable facility={info}/>
                <div className="chart__area">
                  {/* <FinanceChart data={this.props.comparisonData}/> */}
                </div>
              </Tab>
          </Tabs>
        </div>
      </div>
      </div>
    );
  }
}