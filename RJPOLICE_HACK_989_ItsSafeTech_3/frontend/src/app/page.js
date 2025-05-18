"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import NavBar from '../../components/navBar/navBar'
import mp4Icon from '../../public/mp4Icon.png'

import path from 'path';
import RecordingsList from "../../components/recordingList/recordingList";
import WebSocketComponent from "../../components/webSocketComponent/webSocketComponent";

function page() {

  const [updatedRecordings, setUpdatedRecordings] = useState([]);

  const fetchRecordings = async () => {
    const recordingsDir = path.join(process.cwd(), 'recordings');
    try {
      const recordingFiles = await fetch('/api/getRecordings').then((res) => res.json());
      setRecordings(recordingFiles);
    } catch (error) {
      console.error('Error fetching recordings:', error);
    }
  };

  useEffect(() => {
    fetchRecordings();
  }, []); // Fetch recordings on component mount

  const handleNewRecording = () => {
    // Fetch updated recordings or update the state as needed
    console.log('New recording detected!');
    fetchRecordings(); // Refetch recordings when a new recording is detected
  };

  return (
    <div>
      <NavBar/>

      <div className="camFeedWrap">
        <div className="headingDiv">
          <div className="heading">Live CCTV Feed</div>
          <div className="subHeading">All the CCTV feeds will be shown here</div>
        </div>

        <div className="camFeedDiv">
          <div className="camFeedOuter">
            <img  className="camFeed" src="http://127.0.0.1:5000/video_feed"/>
            <p>Cam 1</p>
          </div>

          <div className="camFeedOuter">
            <img  className="camFeed" src='http://127.0.0.1:5000/video_feed' />
            <p>Cam 2</p>
          </div>

          <div className="camFeedOuter">
            <img className="camFeed" />
            <p>Cam 3</p>
          </div>

          <div className="camFeedOuter">
            <img  className="camFeed" />
            <p>Cam 4</p>
          </div>
        </div>
      </div>

      <div className="recordFeedWrap">
        <div className="headingDiv">
          <div className="heading">Recorded Footages</div>
          <div className="subHeading">Recorded footages will be shown here</div>
        </div>

        <div className="recordFeedDiv">
          <div className="recordFeedOuter">
            <Image className='mp4Icon' src={mp4Icon} />
            <p>19-12-2023-20-07-52</p>
          </div>

          {/* <WebSocketComponent onNewRecording={handleNewRecording} />
          <RecordingsList recordings={updatedRecordings} /> */}

          <div className="recordFeedOuter">
            <Image className='mp4Icon' src={mp4Icon} />
            <p>19-12-2023-20-07-52</p>
          </div>

          <div className="recordFeedOuter">
            <Image className='mp4Icon' src={mp4Icon} />
            <p>19-12-2023-20-07-52</p>
          </div>

          <div className="recordFeedOuter">
            <Image className='mp4Icon' src={mp4Icon} />
            <p>19-12-2023-20-07-52</p>
          </div>

          <div className="recordFeedOuter">
            <Image className='mp4Icon' src={mp4Icon} />
            <p>19-12-2023-20-07-52</p>
          </div>

          <div className="recordFeedOuter">
            <Image className='mp4Icon' src={mp4Icon} />
            <p>19-12-2023-20-07-52</p>
          </div>
        </div>
        
      </div>

    </div>
  )
}

export default page