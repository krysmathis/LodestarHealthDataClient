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
  },
  title: {
    display: 'flex' 
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

  getTitle = () => {
    return (
      <div style={{...styles.title}}>
        <h2 style={{...styles.info__h2}}>{this.props.info.facility_Name} </h2>
        <button className="tooltip" onClick={this.setHomeLocation}><svg className='icon h24 w24'><use xlinkHref='#icon-viewport'/></svg>
          <span className="tooltiptext tooltip-left">Save as home location</span>
        </button>
      </div>
    )
  }

  closeFacilityInfo = () => {
    this.props.handleClose(null);
  }

  setHomeLocation = () => {
    const {info} = this.props;
    this.props.setHomeLocation(info.lat, info.long);
  }

  render() {

    const {info} = this.props;
    // cY_Discharges

    const cY_Discharges = this.props.comparisonData.map(f=> f.cY_Discharges)
    
    const likelihoodToRecommend = this.props.comparisonData
        .filter(f => f.likelihood_To_Recommend > 0)
        .map(f=> f.likelihood_To_Recommend)

    const overallScore = this.props.comparisonData
        .filter(f => f.overall_Hospital_Linear_Mean_Score > 0)
        .map(f => f.overall_Hospital_Linear_Mean_Score)
    
    const overallScoreSystem = this.props.comparisonData
      .filter(f => f.overall_Hospital_Linear_Mean_Score > 0 && f.system_Affiliation_Name !== undefined && f.system_Affiliation_Name === info.system_Affiliation_Name)
      .map(f => f.overall_Hospital_Linear_Mean_Score)
    
    const systemCount = overallScoreSystem.length

    return (
      <div>
        <div>
        <div className="info__box">
          <header className='info__header px8 py8 bg-gray-faint round-b-ml txt-s'>
            <button className="tooltip" onClick={this.closeFacilityInfo}><svg className='icon h36 w36'><use xlinkHref='#icon-close'/></svg>
              <span className="tooltiptext tooltip-right">Close</span>
            </button>
          </header>

          <Tabs defaultActiveTabIndex={0} className='tabs__nav'>
              <Tab iconClassName={'icon-class-1'} linkClassName={'link-class-0'} label={'All'}>
                {this.getTitle()}
                <InformationTable facility={info}/>
                <QualityTable facility={info}/>
                <MarketTable facility={info}/>
                <FinanceTable facility={info}/>
              </Tab>
              <Tab iconClassName={'icon-class-1'} linkClassName={'link-class-1'} label={'General'}>
              {this.getTitle()}
                <InformationTable facility={info}/>
                <div className="charts__container">
                  <PerformanceChart title={'CY Discharges'} data={cY_Discharges} threshold={20} facility={info.cY_Discharges} />
                  <PerformanceChart title={'Likelihood To Recommend'} data={likelihoodToRecommend} threshold={20} facility={info.likelihood_To_Recommend} />
                </div>
              </Tab>
              <Tab iconClassName={'icon-class-1'} linkClassName={'link-class-1'} label={'Quality'}>
              {this.getTitle()}
                <QualityTable facility={info}/>
                <div className="charts__container">
                <PerformanceChart title={'Overall Linear Mean Score'} data={overallScore} threshold={20} facility={info.overall_Hospital_Linear_Mean_Score} />
                <PerformanceChart title={`System Overall Linear Mean Score (${systemCount})`} data={overallScoreSystem} threshold={20} facility={info.overall_Hospital_Linear_Mean_Score} />
                </div>
              </Tab>
              <Tab iconClassName={'icon-class-1'} linkClassName={'link-class-1'} label={'Market'}>
              {this.getTitle()}
                <MarketTable facility={info}/>
              </Tab>
              <Tab iconClassName={'icon-class-1'} linkClassName={'link-class-1'} label={'Finance'}>
              {this.getTitle()}
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