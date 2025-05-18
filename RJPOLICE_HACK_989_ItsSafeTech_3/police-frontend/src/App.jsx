// import { useState, useEffect, useRef } from 'react'
// import './App.css'
// import AlarmButton from './AlarmButton'
// import React from 'react';
// import { Howl } from 'howler';

// import sound1 from './assets/climb.mp3';
// import sound2 from './assets/critical.mp3';
// import sound3 from './assets/drill.mp3';
// import sound4 from './assets/mobile.mp3';
// import sound5 from './assets/weapon.mp3';
// import NavBar from './navBar';

// const App = () => {

//   const [isPlaying, setPlaying] = useState(false);
//   const [sound, setSound] = useState(null);

//   const soundRef = useRef(null);

//     const stopAlarm = () => {
//       if (soundRef.current) {
//         soundRef.current.stop(); // Stop the current sound
//         setPlaying(false);
//       }
//     };

//     const playAlarm = () => {
//       stopAlarm();
//       const newSound = new Howl({
//         src: [sound1],
//         volume: 0.5,
//       });
  
//       newSound.play();
//       setPlaying(true);
//       // setSound(newSound);
//       soundRef.current = newSound;

//       setTimeout(() => {
//         stopAlarm();
//       }, 10000)
      
//     };


//     const [angles, setAngles] = useState({
//       left_elbow_hip_angle: 0,
//       right_elbow_hip_angle: 0,
//       left_hip_ankle_angle: 0,
//       right_hip_ankle_angle: 0,
//       left_hip_knee_angle: 0,
//       right_hip_knee_angle: 0,
//     });
  
//     const [climbingData, setClimbingData] = useState({});
   
//     const [climbing, setclimbing] = useState(false);
  
//     const checkClimbingStatus = async () => {
//       try {
//         // Fetch angle data from the Flask server
//         const response = await fetch('http://localhost:5555/angles');
//         const anglesData = await response.json();
  
//         // Threshold values
//         const thresholdValues = {
//           "left_elbow_hip_angle": 150,
//           "left_hip_ankle_angle": 110,
//           "left_hip_knee_angle": 140,
//           "right_elbow_hip_angle": 150,
//           "right_hip_ankle_angle": 170,
//           "right_hip_knee_angle": 100
//         };
  
//         // Check if the person is climbing based on threshold values
//         const riskyMovements = {
//           "left_elbow_hip_angle": anglesData.left_elbow_hip_angle >= thresholdValues["left_elbow_hip_angle"],
//           "right_elbow_hip_angle": anglesData.right_elbow_hip_angle >= thresholdValues["right_elbow_hip_angle"],
//           "left_hip_ankle_angle": anglesData.left_hip_ankle_angle >= thresholdValues["left_hip_ankle_angle"],
//           "right_hip_ankle_angle": anglesData.right_hip_ankle_angle >= thresholdValues["right_hip_ankle_angle"],
//           "left_hip_knee_angle": anglesData.left_hip_knee_angle >= thresholdValues["left_hip_knee_angle"],
//           "right_hip_knee_angle": anglesData.right_hip_knee_angle >= thresholdValues["right_hip_knee_angle"],
//         };
  
//         // Print risky movements
//         // console.log("Risky Movements:", riskyMovements);
  
//         // console.log("Is playing? ", isPlaying);
//         // Check if the person is climbing the wall
//         if (Object.values(riskyMovements).filter(movement => movement).length >= 3) {
//           console.log("Climbing")

         
//             playAlarm();
          
//           // return true
//           // if(!isPlaying){
//           //   playAlarm();
           
//           // }else{
//           //   stopAlarm()
//           // }

//           // setclimbing(true);

//           // setTimeout(() => {
//           //   stopAlarm();
//           //   setclimbing(false);
//           // }, 5000);

          
//           // setClimbingData({ alert: 'Climbing alert' });
//         } else {
//           console.log("Not Climbing")
//           // return false
         
//           // setClimbingData({ alert: 'Not climbing' });
//         }
  
//       } catch (error) {
//         console.error('Error fetching angle data:', error);
//       }
//     };
  
//     const fetchData = async () => {
//       try {
//         const response = await fetch('http://127.0.0.1:5555/angles');
//         const data = await response.json();
//         setAngles(data);
       
  
//         checkClimbingStatus()
         
          
//       } catch (error) {
//         console.error('Error fetching angle data:', error);
//       } finally {
//         setTimeout(fetchData, 100); // Fetch data every 1 second
//       }
//     };
  
//     useEffect(() => {
//       fetchData(); // Start fetching data when the component mounts
     
//       // Listen for climbing alert updates from the backend
//       const socket = new WebSocket('ws://localhost:5555');
//       socket.addEventListener('message', (event) => {
//         const data = JSON.parse(event.data);
//         console.log("My data", data)
//       });
  
//       return () => {
//         socket.close(); // Close the WebSocket connection when the component unmounts
//         stopAlarm();
//       };
//     }, []);


//     useEffect(() => {
//       console.log("My playing", isPlaying)
//     }, [isPlaying])
   
  
//   return (
//     <div>
//       <NavBar/>  
//       <div className='alarmBtns'>
//         <div id="climbingData">{JSON.stringify(climbingData)}</div>
//         <AlarmButton audioFile={sound1} buttonText="Climbing Alert" />
//         <AlarmButton audioFile={sound2} buttonText="Critical Alert" />
//         <AlarmButton audioFile={sound3} buttonText="Drilling Alert" />
//         <AlarmButton audioFile={sound4} buttonText="Mobile Alert" />
//         <AlarmButton audioFile={sound5} buttonText="Weapon Alert" />
//       </div>
//     </div>
//   );
// };

// export default App;import { useState, useEffect, useRef } from 'react';
import './App.css';
import AlarmButton from './AlarmButton';
import { Howl } from 'howler';
import sound1 from './assets/climb.mp3';
import sound2 from './assets/critical.mp3';
import sound3 from './assets/drill.mp3';
import sound4 from './assets/mobile.mp3';
import sound5 from './assets/weapon.mp3';
import NavBar from './navBar';

const App = () => {
  const [isPlaying, setPlaying] = useState(false);
  const soundRef = useRef(null);
  const [openPalmStartTime, setOpenPalmStartTime] = useState(null);
  const [gestureData, setGestureData] = useState({});

  const stopAlarm = () => {
    if (soundRef.current) {
      soundRef.current.stop();
      setPlaying(false);
    }
  };

  const playCriticalAlarm = () => {
    stopAlarm();
    const newSound = new Howl({
      src: [sound2],
      volume: 0.5,
    });
    console.log('Playing critical alarm');
    newSound.play();
    setPlaying(true);
    soundRef.current = newSound;
    setTimeout(() => {
      stopAlarm();
    }, 10000);
  };

  const fetchGestureData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5500/RJPOLICE_HACK_989_ItsSafeTech_3/hand-gesture/gesture');
      console.log('Fetch status:', response.status);
      const data = await response.json();
      console.log('Gesture data:', data);
      setGestureData(data);

      const MIN_CONFIDENCE = 0.50;
      if (data.categoryName === 'Open_Palm' && data.confidence >= MIN_CONFIDENCE) {
        console.log('Open_Palm detected, confidence:', data.confidence);
        if (!openPalmStartTime) {
          console.log('Starting timer');
          setOpenPalmStartTime(Date.now());
        } else {
          const elapsedTime = Date.now() - openPalmStartTime;
          console.log('Elapsed time:', elapsedTime);
          if (elapsedTime >= 5000 && !isPlaying) {
            console.log('Triggering alarm, isPlaying:', isPlaying);
            playCriticalAlarm();
            setOpenPalmStartTime(null);
          }
        }
      } else {
        console.log('No Open_Palm or low confidence:', data);
        setOpenPalmStartTime(null);
      }
    } catch (error) {
      console.error('Error fetching gesture data:', error);
      setOpenPalmStartTime(null);
    } finally {
      setTimeout(fetchGestureData, 100);
    }
  };

  useEffect(() => {
    fetchGestureData();
    return () => {
      stopAlarm();
    };
  }, [openPalmStartTime, isPlaying]);

  useEffect(() => {
    console.log('Is playing:', isPlaying);
  }, [isPlaying]);

  return (
    <div>
      <NavBar />
      <div className='alarmBtns'>
        <div id="gestureData">{JSON.stringify(gestureData)}</div>
        <button onClick={playCriticalAlarm}>Test Critical Alarm</button>
        <AlarmButton audioFile={sound1} buttonText="Climbing Alert" />
        <AlarmButton audioFile={sound2} buttonText="Critical Alert" />
        <AlarmButton audioFile={sound3} buttonText="Drilling Alert" />
        <AlarmButton audioFile={sound4} buttonText="Mobile Alert" />
        <AlarmButton audioFile={sound5} buttonText="Weapon Alert" />
      </div>
    </div>
  );
};

export default App;