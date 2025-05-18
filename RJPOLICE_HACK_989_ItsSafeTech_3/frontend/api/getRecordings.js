import fs from "fs/promises";
import path from "path";

export default async function handler(req, res) {
  const recordingsDir = path.join(process.cwd(), "recordings");
  try {
    const recordingFiles = await fs.readdir(recordingsDir);
    res.status(200).json(recordingFiles);
  } catch (error) {
    console.error("Error fetching recordings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
