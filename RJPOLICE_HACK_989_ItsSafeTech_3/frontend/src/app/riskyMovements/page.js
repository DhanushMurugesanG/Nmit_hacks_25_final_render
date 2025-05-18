"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import NavBar from '../../../components/navBar/navBar';
import AlertCard from '../../../components/alertCard/alertCard';

import A from '../../../public/A.png';
import B from '../../../public/B.png';
import C from '../../../public/C.png';
import D from '../../../public/D.png';
import E from '../../../public/E.png';
import F from '../../../public/F.png';

function RiskyMovements() {
  const [angles, setAngles] = useState({
    left_elbow_hip_angle: 0,
    right_elbow_hip_angle: 0,
    left_hip_ankle_angle: 0,
    right_hip_ankle_angle: 0,
    left_hip_knee_angle: 0,
    right_hip_knee_angle: 0,
  });

  const [climbingData, setClimbingData] = useState({});

  const checkClimbingStatus = async () => {
    try {
      // Fetch angle data from the Flask server
      const response = await fetch('http://localhost:5555/angles');
      const anglesData = await response.json();

      // Threshold values
      const thresholdValues = {
        "left_elbow_hip_angle": 150,
        "left_hip_ankle_angle": 110,
        "left_hip_knee_angle": 140,
        "right_elbow_hip_angle": 150,
        "right_hip_ankle_angle": 170,
        "right_hip_knee_angle": 100
      };

      // Check if the person is climbing based on threshold values
      const riskyMovements = {
        "left_elbow_hip_angle": anglesData.left_elbow_hip_angle >= thresholdValues["left_elbow_hip_angle"],
        "right_elbow_hip_angle": anglesData.right_elbow_hip_angle >= thresholdValues["right_elbow_hip_angle"],
        "left_hip_ankle_angle": anglesData.left_hip_ankle_angle >= thresholdValues["left_hip_ankle_angle"],
        "right_hip_ankle_angle": anglesData.right_hip_ankle_angle >= thresholdValues["right_hip_ankle_angle"],
        "left_hip_knee_angle": anglesData.left_hip_knee_angle >= thresholdValues["left_hip_knee_angle"],
        "right_hip_knee_angle": anglesData.right_hip_knee_angle >= thresholdValues["right_hip_knee_angle"],
      };

      // Print risky movements
      console.log("Risky Movements:", riskyMovements);

      // Check if the person is climbing the wall
      if (Object.values(riskyMovements).filter(movement => movement).length >= 3) {
        console.log("Person is climbing the wall!");
        setClimbingData({ alert: 'Climbing alert' });
      } else {
        console.log("Not climbing");
        setClimbingData({ alert: 'Not climbing' });
      }

    } catch (error) {
      console.error('Error fetching angle data:', error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5555/angles');
      const data = await response.json();
      setAngles(data);

      checkClimbingStatus(); // Call the function to check climbing status

    } catch (error) {
      console.error('Error fetching angle data:', error);
    } finally {
      setTimeout(fetchData, 100); // Fetch data every 1 second
    }
  };

  useEffect(() => {
    fetchData(); // Start fetching data when the component mounts

    // Listen for climbing alert updates from the backend
    const socket = new WebSocket('ws://localhost:5555');
    socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      setClimbingData(data);
    });

    return () => {
      socket.close(); // Close the WebSocket connection when the component unmounts
    };
  }, []);

  return (
    <div>
      <NavBar />

      <div className="camFeedWrap">
            <div className="headingDiv">
              <div className="heading">Risky Movements Detection</div>
              {/* <div id="climbingData">{JSON.stringify(climbingData)}</div> */}
              <div className="subHeading">The risky movements will be detected in this section</div>
            </div>

            <div className="riskyMovCamWrap">
              <div className="riskyMovCamDiv">
                <div className="riskyMovCam">
                  <img className='riskyMovCamFeed' src="http://127.0.0.1:5555/risky_movements" alt="" />
                </div>    
              </div>
              
              <div className="riskyMovAlertsDiv">
                <AlertCard alert={JSON.stringify(climbingData)}/>
                <AlertCard alert="Group are prisoners have weapons in their hand"/>
                <AlertCard alert="Two prisoners named Raman and one more (not detected) trying to climb on wall"/>
                
              </div>
            </div>
        </div>

        <div className='riskyMovMeasurements'>
                   <div className="measureCard">
                    <Image className='measuImg' src={A} alt=''/>
                    <p>A: {angles.left_elbow_hip_angle}</p>
                  </div>

                  <div className="measureCard">
                    <Image  className='measuImg' src={B} alt=''/>
                    <p>B: {angles.right_elbow_hip_angle}</p>
                  </div>

                  <div className="measureCard">
                    <Image  className='measuImg' src={C} alt=''/>
                    <p>C: {angles.left_hip_ankle_angle}</p>
                  </div>

                  <div className="measureCard">
                    <Image  className='measuImg' src={D} alt=''/>
                    <p>D: {angles.right_hip_ankle_angle}</p>
                  </div>

                  <div className="measureCard">
                    <Image  className='measuImg' src={E} alt=''/>
                    <p>E: {angles.left_hip_knee_angle}</p>
                  </div>

                  <div className="measureCard">
                    <Image  className='measuImg' src={F} alt=''/>
                    <p>A: {angles.right_hip_knee_angle}</p>
                  </div>
          </div>
    </div>
  );
}

export default RiskyMovements;
