import React, {PureComponent} from 'react';
import QualityTable from './tables/QualityTable';
import MarketTable from './tables/MarketTable';
import FinanceTable from './tables/FinanceTable';
import InformationTable from './tables/InformationTable';
import PerformanceChart from './charts/PerformanceChart';

import Tabs from './Tabs';
import './Facility-Info.css';

const styles = {

  info__h2: {
    fontWeight: 800,
    fontSize: '1.5em',
    padding: '20px'
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
    console.log(info)
    // cY_Discharges

    const cY_Discharges = this.props.comparisonData.map(f=> f.cY_Discharges)
    
    const likelihoodToRecommend = this.props.comparisonData
        .filter(f => f.likelihood_To_Recommend > 0)
        .map(f=> f.likelihood_To_Recommend)

    const overallScore = this.props.comparisonData
        .filter(f => f.overall_Hospital_Linear_Mean_Score > 0)
        .map(f => f.overall_Hospital_Linear_Mean_Score)
    

    const {info} = this.props;
    const displayName = `${info.facility_Name}`;
console.log(this.props);
    return (
      <div>
        <div>
        <div className="info__box">
          <header className='info__header px8 py8 bg-gray-faint round-b-ml txt-s'>
            <button className="tooltip" onClick={this.setHomeLocation}><svg className='icon h24 w24'><use xlinkHref='#icon-viewport'/></svg>
              <span className="tooltiptext tooltip-right">Save as home location</span>
            </button>
            <button className="tooltip" onClick={this.closeFacilityInfo}><svg className='icon h24 w24'><use xlinkHref='#icon-close'/></svg>
              <span className="tooltiptext tooltip-left">Close</span>
            </button>
          </header>

          <Tabs defaultActiveTabIndex={0} className='tabs__nav'>
              <Tab iconClassName={'icon-class-1'} linkClassName={'link-class-0'} label={'All'}>
              <h2 style={{...styles.info__h2}}>{displayName} </h2>
                <InformationTable facility={info}/>
                <QualityTable facility={info}/>
                <MarketTable facility={info}/>
                <FinanceTable facility={info}/>
              </Tab>
              <Tab iconClassName={'icon-class-1'} linkClassName={'link-class-1'} label={'General'}>
              <h2 style={{...styles.info__h2}}>{displayName} </h2>
                <InformationTable facility={info}/>
                <div className="charts__container">
                  <PerformanceChart title={'CY Discharges'} data={cY_Discharges} threshold={20} facility={info.cY_Discharges} />
                  <PerformanceChart title={'Likelihood To Recommend'} data={likelihoodToRecommend} threshold={20} facility={info.likelihood_To_Recommend} />
                </div>
              </Tab>
              <Tab iconClassName={'icon-class-1'} linkClassName={'link-class-1'} label={'Quality'}>
              <h2 style={{...styles.info__h2}}>{displayName} </h2>
                <QualityTable facility={info}/>
                <PerformanceChart title={'Overall Linear Mean Score'} data={overallScore} threshold={20} facility={info.overall_Hospital_Linear_Mean_Score} />
                {/* <PerformanceChart data={cY_Discharges} threshold={20} facility={info.cY_Discharges} /> */}
              </Tab>
              <Tab iconClassName={'icon-class-1'} linkClassName={'link-class-1'} label={'Market'}>
              <h2 style={{...styles.info__h2}}>{displayName} </h2>
                <MarketTable facility={info}/>
              </Tab>
              <Tab iconClassName={'icon-class-1'} linkClassName={'link-class-1'} label={'Finance'}>
                <h2 style={{...styles.info__h2}}>{displayName} </h2>
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