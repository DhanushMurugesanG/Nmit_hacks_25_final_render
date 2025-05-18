"use client";

// import { useEffect, useRef, useState } from "react";

// export default function HandGesturePage() {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [gestureRecognizer, setGestureRecognizer] = useState(null);
//   const [webcamRunning, setWebcamRunning] = useState(false);
//   const [gestureOutput, setGestureOutput] = useState("");
//   const runningModeRef = useRef("IMAGE");
//   const lastVideoTimeRef = useRef(-1);
//   const videoHeight = "360px";
//   const videoWidth = "480px";

//   // Load MediaPipe library dynamically and initialize GestureRecognizer
//   useEffect(() => {
//     // Dynamically load the MediaPipe script
//     const script = document.createElement("script");
//     script.src = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";
//     script.async = true;
//     script.onload = async () => {
//       const { GestureRecognizer, FilesetResolver, DrawingUtils } = window.MediaPipeTasksVision;

//       // Initialize GestureRecognizer
//       const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm");
//       const recognizer = await GestureRecognizer.createFromOptions(vision, {
//         baseOptions: {
//           modelAssetPath: "/models/gesture_recognizer.task",
//           delegate: "GPU"
//         },
//         runningMode: runningModeRef.current
//       });
//       setGestureRecognizer(recognizer);
//     };
//     script.onerror = () => {
//       console.error("Failed to load MediaPipe script");
//     };
//     document.head.appendChild(script);

//     return () => {
//       document.head.removeChild(script);
//     };
//   }, []);

//   // Handle webcam toggle
//   const enableCam = () => {
//     if (!gestureRecognizer) {
//       alert("Please wait for gestureRecognizer to load");
//       return;
//     }

//     setWebcamRunning((prev) => !prev);
//   };

//   // Start/stop webcam stream
//   useEffect(() => {
//     const video = videoRef.current;
//     if (webcamRunning) {
//       const constraints = { video: true };
//       navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
//         video.srcObject = stream;
//         video.addEventListener("loadeddata", predictWebcam);
//       });
//     } else {
//       if (video.srcObject) {
//         video.srcObject.getTracks().forEach(track => track.stop());
//       }
//     }

//     return () => {
//       if (video.srcObject) {
//         video.srcObject.getTracks().forEach(track => track.stop());
//       }
//     };
//   }, [webcamRunning]);

//   // Predict gestures from webcam
//   const predictWebcam = async () => {
//     if (!gestureRecognizer || !webcamRunning) return;

//     const video = videoRef.current;
//     const canvas = canvasRef.current;
//     const canvasCtx = canvas.getContext("2d");

//     if (runningModeRef.current === "IMAGE") {
//       runningModeRef.current = "VIDEO";
//       await gestureRecognizer.setOptions({ runningMode: "VIDEO" });
//     }

//     let nowInMs = Date.now();
//     if (video.currentTime !== lastVideoTimeRef.current) {
//       lastVideoTimeRef.current = video.currentTime;
//       const results = gestureRecognizer.recognizeForVideo(video, nowInMs);

//       canvasCtx.save();
//       canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
//       const drawingUtils = new window.MediaPipeTasksVision.DrawingUtils(canvasCtx);
//       canvas.style.height = videoHeight;
//       video.style.height = videoHeight;
//       canvas.style.width = videoWidth;
//       video.style.width = videoWidth;

//       if (results.landmarks) {
//         for (const landmarks of results.landmarks) {
//           drawingUtils.drawConnectors(landmarks, window.MediaPipeTasksVision.GestureRecognizer.HAND_CONNECTIONS, {
//             color: "#00FF00",
//             lineWidth: 5
//           });
//           drawingUtils.drawLandmarks(landmarks, {
//             color: "#FF0000",
//             lineWidth: 2
//           });
//         }
//       }
//       canvasCtx.restore();

//       if (results.gestures.length > 0) {
//         const categoryName = results.gestures[0][0].categoryName;
//         const categoryScore = parseFloat(results.gestures[0][0].score * 100).toFixed(2);
//         const handedness = results.handednesses[0][0].displayName;
//         setGestureOutput(`GestureRecognizer: ${categoryName}\n Confidence: ${categoryScore} %\n Handedness: ${handedness}`);
//       } else {
//         setGestureOutput("");
//       }
//     }

//     if (webcamRunning) {
//       window.requestAnimationFrame(predictWebcam);
//     }
//   };

//   return (
//     <>
//       <link href="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css" rel="stylesheet" />
//       <script src="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.js"></script>
//       <style>{`
//         .videoView { display: flex; flex-direction: column; align-items: center; }
//         .output { position: absolute; left: 0px; bottom: 0px; color: white; background: rgba(0, 0, 0, 0.7); padding: 5px; }
//         button.mdc-button--raised { margin: 10px; }
//       `}</style>
//       <div className="videoView">
//         <button className="mdc-button mdc-button--raised" onClick={enableCam}>
//           <span className="mdc-button__ripple"></span>
//           <span className="mdc-button__label">{webcamRunning ? "DISABLE PREDICTIONS" : "ENABLE WEBCAM"}</span>
//         </button>
//         <div style={{ position: "relative" }}>
//           <video ref={videoRef} autoPlay playsInline />
//           <canvas ref={canvasRef} className="output_canvas" width="1280" height="720" style={{ position: "absolute", left: 0, top: 0 }} />
//           {gestureOutput && <p className="output" style={{ width: videoWidth }}>{gestureOutput}</p>}
//         </div>
//       </div>
//     </>
//   );
// }



// HandGestureRecognizerWidget.js
// Combine HTML, CSS, JS for MediaPipe HandGestureRecognizer in a single file/component
// Use with Next.js by importing and injecting into your component (e.g. in a useEffect in Navbar)

// import { useEffect } from "react";

// // This component injects the widget into the DOM and cleans up on unmount
// export default function HandGestureRecognizerWidget() {
//   useEffect(() => {
//     // 1. Inject CSS
//     const style = document.createElement("style");
//     style.innerHTML = `
//     @import url('https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap');
//     body {
//       font-family: roboto, Arial, sans-serif;
//       margin: 2em;
//       color: #3d3d3d;
//       --mdc-theme-primary: #000000;
//       --mdc-theme-on-primary: #f1f3f4;
//     }
//     .videoView {
//       position: absolute;
//       float: left;
//       width: 48%;
//       margin: 2% 1%;
//       cursor: pointer;
//       min-height: 500px;
//     }
//     .output_canvas {
//       transform: rotateY(180deg);
//       -webkit-transform: rotateY(180deg);
//       -moz-transform: rotateY(180deg);
//     }
//     .output {
//       display: none;
//       width: 100%;
//       font-size: calc(8px + 1.2vw);
//     }
//     .mdc-button.mdc-button--raised {
//       background: #000;
//       color: #f1f3f4;
//       font-weight: bold;
//     }
//     `;
//     document.head.appendChild(style);

//     // 2. Inject Material CSS
//     const materialCSS = document.createElement("link");
//     materialCSS.rel = "stylesheet";
//     materialCSS.href =
//       "https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css";
//     document.head.appendChild(materialCSS);

//     // 3. Inject Material JS
//     const materialScript = document.createElement("script");
//     materialScript.src =
//       "https://unpkg.com/material-components-web@latest/dist/material-components-web.min.js";
//     materialScript.async = true;
//     document.body.appendChild(materialScript);

//     // 4. Add the widget to the body (or use a container in your component)
//     const container = document.createElement("div");
//     container.id = "HandGestureRecognizerWidgetContainer";
//     container.innerHTML = `
//       <div id="liveView" class="videoView">
//         <button id="webcamButton" class="mdc-button mdc-button--raised">
//           <span class="mdc-button__ripple"></span>
//           <span class="mdc-button__label">ENABLE WEBCAM</span>
//         </button>
//         <div style="position: relative;">
//           <video id="webcam" autoplay playsinline></video>
//           <canvas class="output_canvas" id="output_canvas" width="1280" height="720" style="position: absolute; left: 0px; top: 0px;"></canvas>
//           <p id='gesture_output' class="output"></p>
//         </div>
//       </div>
//     `;
//     document.body.appendChild(container);

//     // 5. Import MediaPipe and run the logic
//     let gestureRecognizer;
//     let runningMode = "IMAGE";
//     let enableWebcamButton;
//     let webcamRunning = false;
//     const videoHeight = "360px";
//     const videoWidth = "480px";
//     let lastVideoTime = -1;
//     let results = undefined;

//     // WebSocket Example (optional - you can remove this if not needed)
//     // const socket = new WebSocket('wss://broker.hivemq.com:8884/mqtt');
//     // socket.addEventListener('open', (event) => {
//     //   console.log("Socket open");
//     //   socket.send("Hi");
//     // });
//     // socket.addEventListener('message', (event) => {
//     //   console.log('Message from server:', event.data);
//     // });
//     // socket.addEventListener('close', (event) => {
//     //   console.log("Socket closed", event);
//     // });

//     // Dynamically import the MediaPipe library
//     let vision, DrawingUtils, GestureRecognizer, FilesetResolver;
//     let script = document.createElement("script");
//     script.type = "module";
//     script.innerHTML = `
//       import {
//         GestureRecognizer,
//         FilesetResolver,
//         DrawingUtils
//       } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";
//       window.GestureRecognizer = GestureRecognizer;
//       window.FilesetResolver = FilesetResolver;
//       window.DrawingUtils = DrawingUtils;
//     `;
//     document.body.appendChild(script);

//     // Wait for the module to be registered on window
//     async function waitForMediaPipe() {
//       while (
//         !window.GestureRecognizer ||
//         !window.FilesetResolver ||
//         !window.DrawingUtils
//       ) {
//         await new Promise((r) => setTimeout(r, 100));
//       }
//       GestureRecognizer = window.GestureRecognizer;
//       FilesetResolver = window.FilesetResolver;
//       DrawingUtils = window.DrawingUtils;
//     }

//     async function createGestureRecognizer() {
//       await waitForMediaPipe();
//       vision = await FilesetResolver.forVisionTasks(
//         "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
//       );
//       gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
//         baseOptions: {
//           modelAssetPath:
//             "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
//           delegate: "GPU",
//         },
//         runningMode: runningMode,
//       });
//     }

//     createGestureRecognizer();

//     // Webcam logic
//     const video = container.querySelector("#webcam");
//     const canvasElement = container.querySelector("#output_canvas");
//     const canvasCtx = canvasElement.getContext("2d");
//     const gestureOutput = container.querySelector("#gesture_output");

//     function hasGetUserMedia() {
//       return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
//     }

//     if (hasGetUserMedia()) {
//       enableWebcamButton = container.querySelector("#webcamButton");
//       enableWebcamButton.addEventListener("click", enableCam);
//     } else {
//       console.warn("getUserMedia() is not supported by your browser");
//     }

//     function enableCam(event) {
//       if (!gestureRecognizer) {
//         alert("Please wait for gestureRecognizer to load");
//         return;
//       }
//       if (webcamRunning === true) {
//         webcamRunning = false;
//         enableWebcamButton.innerText = "ENABLE PREDICTIONS";
//       } else {
//         webcamRunning = true;
//         enableWebcamButton.innerText = "DISABLE PREDICTIONS";
//       }
//       const constraints = { video: true };
//       navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
//         video.srcObject = stream;
//         video.addEventListener("loadeddata", predictWebcam);
//       });
//     }

//     async function predictWebcam() {
//       const webcamElement = video;
//       if (runningMode === "IMAGE") {
//         runningMode = "VIDEO";
//         await gestureRecognizer.setOptions({ runningMode: "VIDEO" });
//       }
//       let nowInMs = Date.now();
//       if (video.currentTime !== lastVideoTime) {
//         lastVideoTime = video.currentTime;
//         results = gestureRecognizer.recognizeForVideo(video, nowInMs);
//       }
//       canvasCtx.save();
//       canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
//       const drawingUtils = new DrawingUtils(canvasCtx);
//       canvasElement.style.height = videoHeight;
//       webcamElement.style.height = videoHeight;
//       canvasElement.style.width = videoWidth;
//       webcamElement.style.width = videoWidth;
//       if (results?.landmarks) {
//         for (const landmarks of results.landmarks) {
//           drawingUtils.drawConnectors(
//             landmarks,
//             GestureRecognizer.HAND_CONNECTIONS,
//             { color: "#00FF00", lineWidth: 5 }
//           );
//           drawingUtils.drawLandmarks(landmarks, {
//             color: "#FF0000",
//             lineWidth: 2,
//           });
//         }
//       }
//       canvasCtx.restore();
//       if (results?.gestures?.length > 0) {
//         gestureOutput.style.display = "block";
//         gestureOutput.style.width = videoWidth;
//         const categoryName = results.gestures[0][0].categoryName;
//         const categoryScore = parseFloat(
//           results.gestures[0][0].score * 100
//         ).toFixed(2);
//         const handedness = results.handednesses[0][0].displayName;
//         gestureOutput.innerText = `GestureRecognizer: ${categoryName}\n Confidence: ${categoryScore} %\n Handedness: ${handedness}`;
//       } else {
//         gestureOutput.style.display = "none";
//       }
//       if (webcamRunning === true) {
//         window.requestAnimationFrame(predictWebcam);
//       }
//     }

//     // Cleanup on unmount
//     return () => {
//       document.head.removeChild(style);
//       document.head.removeChild(materialCSS);
//       document.body.removeChild(materialScript);
//       document.body.removeChild(container);
//       if (script) document.body.removeChild(script);
//     };
//   }, []);

//   // This component does not render anything itself;
//   // it injects widget markup/scripts directly into the DOM.
//   return null;
// }

import HandGestureIframe from "../../../components/hgframe";

export default function Page() {
  return (
    <main>
     
      <HandGestureIframe />
    </main>
  );
}