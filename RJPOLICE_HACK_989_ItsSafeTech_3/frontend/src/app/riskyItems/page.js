"use client"

import React, { useEffect, useRef } from 'react';
import NavBar from '../../../components/navBar/navBar'
import AlertCard from '../../../components/alertCard/alertCard'
import Webcam from 'react-webcam';

function riskyItems() {
  const webcamRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:7000/knife_detection', {
          method: 'GET',
          headers: {
            'Content-Type': 'image/jpeg',
          },
        });

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);

        // Update the video frame
        webcamRef.current.video.src = imageUrl;
      } catch (error) {
        console.error('Error fetching video feed:', error);
      }

      // Fetch the next frame after a short delay
      setTimeout(fetchData, 100);
    };

    fetchData();
  }, []);

  return (
    <div>
        <NavBar/>

        <div className="camFeedWrap">
            <div className="headingDiv">
              <div className="heading">Gun Detection</div>
              {/* <div id="climbingData">{JSON.stringify(climbingData)}</div> */}
              <div className="subHeading">The guns will be detected in this section</div>
            </div>

            <div className="riskyMovCamWrap">
              <div className="riskyMovCamDiv">
                <div className="riskyMovCam">
                  {/* <img className='riskyMovCamFeed' ref={videoRef} /> */}
                  <Webcam ref={webcamRef} />
                </div>    
              </div>
              
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
              <div className="subHeading">The knifes will be detected in this section</div>
            </div>

            <div className="riskyMovCamWrap">
              <div className="riskyMovCamDiv">
                <div className="riskyMovCam">
                  <img className='riskyMovCamFeed' src="http://127.0.0.1:5000/knife_detection" alt="" />
                </div>    
              </div>
              
              <div className="riskyMovAlertsDiv">
                <AlertCard alert="Test"/>
                <AlertCard alert="Group are prisoners have weapons in their hand"/>
                <AlertCard alert="Two prisoners named Raman and one more (not detected) trying to climb on wall"/>
                
              </div>
            </div>
        </div>
    </div>
  )
}

export default riskyItems