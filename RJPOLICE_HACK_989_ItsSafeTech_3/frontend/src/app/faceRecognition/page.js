import React from 'react'
import NavBar from '../../../components/navBar/navBar'

function faceRecognition() {
  return (
    <div>
        <NavBar/>

        <div className="camFeedWrap">
            <div className="headingDiv">
              <div className="heading">Face Recognition</div>
              <div className="subHeading">The Faces will be recognized in this section</div>
            </div>

              <div className="faceRecogCamDiv">
                <div className="faceRecogCam">
                  <img className='faceRecogCamFeed' src="http://localhost:3000/" alt="" />
                </div>    
              </div>
        </div>        
    </div>
  )
}

export default faceRecognition