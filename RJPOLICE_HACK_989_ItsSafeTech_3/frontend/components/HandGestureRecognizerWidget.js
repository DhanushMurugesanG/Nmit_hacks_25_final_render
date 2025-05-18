// import React, { useRef, useEffect, useState } from "react";

// export default function HandGestureRecognizerWidget() {
//   // Internal state
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [recognizerReady, setRecognizerReady] = useState(false);
//   const [recognizer, setRecognizer] = useState(null);
//   const [runningMode, setRunningMode] = useState("IMAGE");
//   const [webcamRunning, setWebcamRunning] = useState(false);
//   const [gestureOutput, setGestureOutput] = useState("");
//   const animationRef = useRef(null);

//   // CSS inject
//   useEffect(() => {
//     const style = document.createElement("style");
//     style.innerHTML = `
//       .hand-gesture-widget-videoView {
//         position: fixed;
//         bottom: 1.5em;
//         right: 1.5em;
//         background: #fff;
//         border-radius: 12px;
//         box-shadow: 0 2px 18px rgba(0,0,0,0.18);
//         z-index: 99999;
//         padding: 1.2em 1em;
//         min-width: 350px;
//         max-width: 95vw;
//       }
//       .hand-gesture-widget-button {
//         background: #000;
//         color: #fff;
//         border: none;
//         outline: none;
//         font-size: 1em;
//         border-radius: 5px;
//         padding: 0.7em 1.5em;
//         font-weight: bold;
//         margin-bottom: 1em;
//         cursor: pointer;
//       }
//       .hand-gesture-widget-output {
//         min-height: 2.5em;
//         font-family: monospace;
//         font-size: 1em;
//         color: #007f8b;
//         margin-top: 1em;
//         white-space: pre-line;
//       }
//       .hand-gesture-widget-canvas, 
//       .hand-gesture-widget-video {
//         width: 320px; height: 180px;
//         border-radius: 8px;
//       }
//       @media (max-width: 500px) {
//         .hand-gesture-widget-videoView { left: 2vw; right: 2vw; min-width: 0; }
//         .hand-gesture-widget-canvas, .hand-gesture-widget-video { width: 90vw; height: 50vw; }
//       }
//     `;
//     document.head.appendChild(style);
//     return () => { document.head.removeChild(style); };
//   }, []);

//   // Load MediaPipe vision modules on mount
//   useEffect(() => {
//     let cancelled = false;
//     async function loadRecognizer() {
//       try {
//         const vision = await import(
//           "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3"
//         );
//         const wasmFileset = await vision.FilesetResolver.forVisionTasks(
//           "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
//         );
//         const gestureRecognizer = await vision.GestureRecognizer.createFromOptions(wasmFileset, {
//           baseOptions: {
//             modelAssetPath: "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
//             delegate: "GPU",
//           },
//           runningMode,
//         });
//         if (!cancelled) {
//           setRecognizer(() => gestureRecognizer);
//           setRecognizerReady(true);
//         }
//       } catch (e) {
//         alert("Error loading MediaPipe. Check network and console.");
//         // eslint-disable-next-line no-console
//         console.error("Gesture recognizer load failed:", e);
//       }
//     }
//     loadRecognizer();
//     return () => { cancelled = true; };
//   }, []);

//   // Webcam prediction loop
//   useEffect(() => {
//     if (!recognizer || !webcamRunning) return;

//     let lastVideoTime = -1;
//     let stopped = false;
//     const video = videoRef.current;
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");
//     const { DrawingUtils, GestureRecognizer } = recognizer.constructor;
//     const drawingUtils = new DrawingUtils(ctx);

//     async function predict() {
//       if (stopped) return;
//       if (recognizer.runningMode !== "VIDEO") {
//         await recognizer.setOptions({ runningMode: "VIDEO" });
//       }
//       if (video.currentTime !== lastVideoTime) {
//         lastVideoTime = video.currentTime;
//         const results = recognizer.recognizeForVideo(video, Date.now());
//         ctx.save();
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//         canvas.style.width = video.style.width;
//         canvas.style.height = video.style.height;
//         if (results.landmarks) {
//           for (const landmarks of results.landmarks) {
//             drawingUtils.drawConnectors(landmarks, GestureRecognizer.HAND_CONNECTIONS, {
//               color: "#00FF00", lineWidth: 5,
//             });
//             drawingUtils.drawLandmarks(landmarks, { color: "#FF0000", lineWidth: 2 });
//           }
//         }
//         ctx.restore();
//         if (results.gestures?.length > 0) {
//           const categoryName = results.gestures[0][0].categoryName;
//           const categoryScore = parseFloat(results.gestures[0][0].score * 100).toFixed(2);
//           const handedness = results.handednesses[0][0].displayName;
//           setGestureOutput(
//             `GestureRecognizer: ${categoryName}\nConfidence: ${categoryScore}%\nHandedness: ${handedness}`
//           );
//         } else {
//           setGestureOutput("");
//         }
//       }
//       animationRef.current = requestAnimationFrame(predict);
//     }
//     animationRef.current = requestAnimationFrame(predict);
//     return () => {
//       stopped = true;
//       if (animationRef.current) cancelAnimationFrame(animationRef.current);
//     };
//   }, [recognizer, webcamRunning]);

//   // Start/stop webcam
//   const handleWebcamButton = async () => {
//     if (webcamRunning) {
//       setWebcamRunning(false);
//       const video = videoRef.current;
//       if (video && video.srcObject) {
//         video.srcObject.getTracks().forEach((track) => track.stop());
//         video.srcObject = null;
//       }
//       setGestureOutput("");
//       return;
//     }
//     if (!recognizerReady) return;
//     try {
//       const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
//       const video = videoRef.current;
//       video.srcObject = mediaStream;
//       video.onloadeddata = () => {
//         setWebcamRunning(true);
//       };
//     } catch (err) {
//       alert("Webcam access denied or unavailable.");
//     }
//   };

//   return (
//     <div className="hand-gesture-widget-videoView">
//       <button
//         className="hand-gesture-widget-button"
//         onClick={handleWebcamButton}
//         disabled={!recognizerReady}
//       >
//         {webcamRunning ? "DISABLE WEBCAM" : recognizerReady ? "ENABLE WEBCAM" : "Loading..."}
//       </button>
//       <div style={{ position: "relative" }}>
//         <video
//           ref={videoRef}
//           className="hand-gesture-widget-video"
//           autoPlay
//           playsInline
//           muted
//           style={{
//             width: "320px",
//             height: "180px",
//             display: "block",
//             background: "#222",
//             transform: "rotateY(180deg)",
//           }}
//         />
//         <canvas
//           ref={canvasRef}
//           className="hand-gesture-widget-canvas"
//           width={320}
//           height={180}
//           style={{
//             position: "absolute",
//             left: 0,
//             top: 0,
//             pointerEvents: "none",
//             transform: "rotateY(180deg)",
//           }}
//         />
//       </div>
//       <div className="hand-gesture-widget-output">{gestureOutput}</div>
//     </div>
//   );
// }
'use client';

import { useEffect, useRef, useState } from "react";
import {
  FilesetResolver,
  GestureRecognizer,
} from "@mediapipe/tasks-vision";

export default function HandGestureRecognizerWidget() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [gesture, setGesture] = useState("");
  const [ready, setReady] = useState(false);
  const recognizerRef = useRef(null);
  const animationRef = useRef(null);

  // Start webcam and load model
  useEffect(() => {
    let stream;
    let stop = false;

    async function setup() {
      // Start webcam
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      // Load model
      const filesetResolver = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
      );
      recognizerRef.current = await GestureRecognizer.createFromOptions(
        filesetResolver,
        {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
        }
      );
      setReady(true);
      loop();
    }

    async function loop() {
      if (
        stop ||
        !videoRef.current ||
        !canvasRef.current ||
        !recognizerRef.current
      ) {
        return;
      }
      if (videoRef.current.readyState >= 2) {
        // Predict
        const results = await recognizerRef.current.recognizeForVideo(
          videoRef.current,
          performance.now()
        );
        // Draw to canvas (mirror video)
        const ctx = canvasRef.current.getContext("2d");
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(
          videoRef.current,
          -canvasRef.current.width,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        ctx.restore();

        // Show gesture (if any)
        if (
          results.gestures &&
          results.gestures.length > 0 &&
          results.gestures[0][0]
        ) {
          setGesture(results.gestures[0][0].categoryName);
        } else {
          setGesture("");
        }
      }
      animationRef.current = requestAnimationFrame(loop);
    }

    setup();

    return () => {
      stop = true;
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // Make canvas match video size
  useEffect(() => {
    function syncCanvasSize() {
      if (videoRef.current && canvasRef.current) {
        canvasRef.current.width = videoRef.current.videoWidth || 640;
        canvasRef.current.height = videoRef.current.videoHeight || 480;
      }
    }
    if (videoRef.current) {
      videoRef.current.onloadedmetadata = syncCanvasSize;
    }
    return () => {
      if (videoRef.current) videoRef.current.onloadedmetadata = null;
    };
  }, []);

  return (
    <div style={{ position: "relative", width: 640, height: 480 }}>
      <video
        ref={videoRef}
        style={{ display: "none" }}
        width={640}
        height={480}
        playsInline
        muted
      />
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        style={{
          width: "100%",
          height: "100%",
          border: "1px solid #ccc",
          borderRadius: 8,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          padding: "16px 0",
          background: "rgba(0,0,0,0.5)",
          color: "#fff",
          textAlign: "center",
          fontSize: 24,
          fontWeight: "bold",
        }}
      >
        {ready ? gesture || "Show a hand gesture!" : "Loading model..."}
      </div>
    </div>
  );
}