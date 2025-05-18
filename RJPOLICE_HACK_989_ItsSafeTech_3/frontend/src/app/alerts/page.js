import React from 'react'
import NavBar from '../../../components/navBar/navBar'
import AlertCard from '../../../components/alertCard/alertCard'

function alerts() {
  return (
    <div>
        
        <NavBar/>

        <div className="alertsCardWrap">
            <div className="camFeedWrap">
                <div className="headingDiv">
                <div className="heading">Risky Movements Detection</div>
                {/* <div id="climbingData">{JSON.stringify(climbingData)}</div> */}
                <div className="subHeading">The guns will be detected in this section</div>
                </div>

                <div className="alertsDiv">
                <div className="riskyMovAlertsDiv">
                    <AlertCard alert="Test"/>
                    <AlertCard alert="Group are prisoners have weapons in their hand"/>
                    <AlertCard alert="Two prisoners named Raman and one more (not detected) trying to climb on wall"/>
                    
                </div>
                </div>
            </div>

            <div className="camFeedWrap">
                <div className="headingDiv">
                <div className="heading">Gun Detection</div>
                {/* <div id="climbingData">{JSON.stringify(climbingData)}</div> */}
                <div className="subHeading">The guns will be detected in this section</div>
                </div>

                <div className="alertsDiv">
                <div className="riskyMovAlertsDiv">
                    <AlertCard alert="Test"/>
                    <AlertCard alert="Group are prisoners have weapons in their hand"/>
                    <AlertCard alert="Two prisoners named Raman and one more (not detected) trying to climb on wall"/>
                    
                </div>
                </div>
            </div>

            <div className="camFeedWrap">
                <div className="headingDiv">
                <div className="heading">Knife Detection</div>
                {/* <div id="climbingData">{JSON.stringify(climbingData)}</div> */}
                <div className="subHeading">The guns will be detected in this section</div>
                </div>

                <div className="alertsDiv">
                <div className="riskyMovAlertsDiv">
                    <AlertCard alert="Test"/>
                    <AlertCard alert="Group are prisoners have weapons in their hand"/>
                    <AlertCard alert="Two prisoners named Raman and one more (not detected) trying to climb on wall"/>
                    
                </div>
                </div>
            </div>

            <div className="camFeedWrap">
                <div className="headingDiv">
                <div className="heading">Gun Detection</div>
                {/* <div id="climbingData">{JSON.stringify(climbingData)}</div> */}
                <div className="subHeading">The guns will be detected in this section</div>
                </div>

                <div className="alertsDiv">
                <div className="riskyMovAlertsDiv">
                    <AlertCard alert="Test"/>
                    <AlertCard alert="Group are prisoners have weapons in their hand"/>
                    <AlertCard alert="Two prisoners named Raman and one more (not detected) trying to climb on wall"/>
                    
                </div>
                </div>
            </div>

        </div>
    </div>
  )
}

export default alerts