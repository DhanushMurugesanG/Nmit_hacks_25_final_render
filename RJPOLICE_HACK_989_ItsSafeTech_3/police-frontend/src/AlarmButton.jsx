// import React, { useState } from 'react';
// import { Howl } from 'howler';
// import alarmSound from './assets/emergency-alarm-with-reverb-29431.mp3'; // Import the audio file

// const AlarmButton = () => {
//   const [isPlaying, setPlaying] = useState(false);

//   const playAlarm = () => {
//     const sound = new Howl({
//       src: [alarmSound], // Use the imported audio file
//       volume: 0.5, // Adjust the volume
//     });

//     sound.play();
//     setPlaying(true);
//     console.log("playing");

//     // Stop playing after the sound finishes
//     sound.on('end', () => {
//       setPlaying(false);
//       console.log("stop");
//     });
//   };

//   return (
//     <div>
//       <button onClick={playAlarm} disabled={isPlaying}>
//         {isPlaying ? 'Alarm Playing' : 'Play Alarm'}
//       </button>
//     </div>
//   );
// };

// export default AlarmButton;

import React, { useState, useEffect } from 'react';
import { Howl } from 'howler';

const AlarmButton = ({ audioFile, buttonText }) => {
  const [isPlaying, setPlaying] = useState(false);
  const [sound, setSound] = useState(null);

  const playAlarm = () => {
    const newSound = new Howl({
      src: [audioFile],
      volume: 0.5,
    });

    newSound.play();
    setPlaying(true);
    setSound(newSound);
    console.log("playing");
  };

  const stopAlarm = () => {
    if (sound) {
      sound.stop();
      setPlaying(false);
      console.log("stop");
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup on component unmount
      stopAlarm();
    };
  }, []);

  return (
    <div>
      <button onClick={isPlaying ? stopAlarm : playAlarm} style={{padding: '17px 30px 17px 30px'}}>
        {isPlaying ? 'Pause' : `Play ${buttonText}`}
      </button>
      {isPlaying && (
        <button onClick={stopAlarm} style={{ marginLeft: '8px' }}>
          Stop
        </button>
      )}
    </div>
  );
};

export default AlarmButton;
