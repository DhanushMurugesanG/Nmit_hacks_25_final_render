import React from 'react'
import NavBar from '../../../components/navBar/navBar'
import AlertCard from '../../../components/alertCard/alertCard'

function weaponDetection() {
  return (
    <div>
        <NavBar/>

        <div className="camFeedWrap">
            <div className="headingDiv">
            <div className="heading">Weapon Detection</div>
            <div className="subHeading">The weapons will be detected in this section</div>
            </div>

            <div className="riskyMovCamWrap">
            <div className="riskyMovCamDiv">
                <div className="riskyMovCam">
                <img className='riskyMovCamFeed' src="http://127.0.0.1:5004/weapon_detection" alt="" />
                </div>    
            </div>
            
            <div className="riskyMovAlertsDiv">
                <AlertCard alert="A prisoner named Ravi trying to climb on wall"/>
                <AlertCard alert="Group are prisoners have weapons in their hand"/>
                <AlertCard alert="Two prisoners named Raman and one more (not detected) trying to climb on wall"/>
                
            </div>
            </div>
        </div>
    </div>
  )
}

export default weaponDetection