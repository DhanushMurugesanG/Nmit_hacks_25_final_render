import { useEffect, useState } from "react";
import axios from "axios"; 
import path from "path";

const RecordingsList = () => {
  const [recordings, setRecordings] = useState([]);

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const response = await axios.get("/api/getRecordings");
        setRecordings(response.data);
      } catch (error) {
        console.error("Error fetching recordings:", error);
      }
    };

    fetchRecordings();
  }, []);

  return (
    <div>
      <h2>Recordings</h2>
      <ul>
        {recordings.map((recording) => (
          <li key={recording}>
            <a href={`/recordings/${recording}`} download>
              {recording}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecordingsList;
