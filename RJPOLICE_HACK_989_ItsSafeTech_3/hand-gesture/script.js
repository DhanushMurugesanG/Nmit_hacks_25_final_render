
import { GestureRecognizer, FilesetResolver, DrawingUtils } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";

const demosSection = document.getElementById("demos");
let gestureRecognizer;
let runningMode = "IMAGE";
let enableWebcamButton;
let webcamRunning = false;
const videoHeight = "360px";
const videoWidth = "480px";

// Audio setup
const audio = new Audio("/RJPOLICE_HACK_989_ItsSafeTech_3/hand-gesture/critical.mp3");
audio.volume = 0.5;
let isPlaying = false;
let openPalmStartTime = null;
let thumbUpStartTime = null;

const createGestureRecognizer = async () => {
    const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm");
    gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
            delegate: "GPU"
        },
        runningMode: runningMode
    });
    demosSection.classList.remove("invisible");
};
createGestureRecognizer();

const imageContainers = document.getElementsByClassName("detectOnClick");
for (let i = 0; i < imageContainers.length; i++) {
    imageContainers[i].children[0].addEventListener("click", handleClick);
}

async function handleClick(event) {
    if (!gestureRecognizer) {
        alert("Please wait for gestureRecognizer to load");
        return;
    }
    if (runningMode === "VIDEO") {
        runningMode = "IMAGE";
        await gestureRecognizer.setOptions({ runningMode: "IMAGE" });
    }
    const allCanvas = event.target.parentNode.getElementsByClassName("canvas");
    for (var i = allCanvas.length - 1; i >= 0; i--) {
        const n = allCanvas[i];
        n.parentNode.removeChild(n);
    }
    const results = gestureRecognizer.recognize(event.target);
    console.log(results);
    if (results.gestures.length > 0) {
        const p = event.target.parentNode.childNodes[3];
        p.setAttribute("class", "info");
        const categoryName = results.gestures[0][0].categoryName;
        const categoryScore = parseFloat(results.gestures[0][0].score * 100).toFixed(2);
        const handedness = results.handednesses[0][0].displayName;
        p.innerText = `GestureRecognizer: ${categoryName}\n Confidence: ${categoryScore}%\n Handedness: ${handedness}`;
        p.style =
            "left: 0px;" +
            "top: " +
            event.target.height +
            "px; " +
            "width: " +
            (event.target.width - 10) +
            "px;";
        const canvas = document.createElement("canvas");
        canvas.setAttribute("class", "canvas");
        canvas.setAttribute("width", event.target.naturalWidth + "px");
        canvas.setAttribute("height", event.target.naturalHeight + "px");
        canvas.style =
            "left: 0px;" +
            "top: 0px;" +
            "width: " +
            event.target.width +
            "px;" +
            "height: " +
            event.target.height +
            "px;";
        event.target.parentNode.appendChild(canvas);
        const canvasCtx = canvas.getContext("2d");
        const drawingUtils = new DrawingUtils(canvasCtx);
        for (const landmarks of results.landmarks) {
            drawingUtils.drawConnectors(landmarks, GestureRecognizer.HAND_CONNECTIONS, {
                color: "#00FF00",
                lineWidth: 5
            });
            drawingUtils.drawLandmarks(landmarks, {
                color: "#FF0000",
                lineWidth: 1
            });
        }
    }
}

const video = document.getElementById("webcam");
const canvasElement = document.getElementById("output_canvas");
const canvasCtx = canvasElement.getContext("2d");
const gestureOutput = document.getElementById("gesture_output");

function hasGetUserMedia() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

if (hasGetUserMedia()) {
    enableWebcamButton = document.getElementById("webcamButton");
    enableWebcamButton.addEventListener("click", enableCam);
} else {
    console.warn("getUserMedia() is not supported by your browser");
}

function enableCam(event) {
    if (!gestureRecognizer) {
        alert("Please wait for gestureRecognizer to load");
        return;
    }
    if (webcamRunning === true) {
        webcamRunning = false;
        enableWebcamButton.innerText = "ENABLE PREDICTIONS";
        audio.pause();
        audio.currentTime = 0;
        isPlaying = false;
        openPalmStartTime = null;
        thumbUpStartTime = null;
    } else {
        webcamRunning = true;
        enableWebcamButton.innerText = "DISABLE PREDICTIONS";
    }
    const constraints = {
        video: true
    };
    navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
        video.srcObject = stream;
        video.addEventListener("loadeddata", predictWebcam);
    }).catch(error => console.error('Webcam error:', error));
}

let lastVideoTime = -1;
let results = undefined;

async function predictWebcam() {
    const webcamElement = document.getElementById("webcam");
    if (runningMode === "IMAGE") {
        runningMode = "VIDEO";
        await gestureRecognizer.setOptions({ runningMode: "VIDEO" });
    }
    let nowInMs = Date.now();
    if (video.currentTime !== lastVideoTime) {
        lastVideoTime = video.currentTime;
        results = gestureRecognizer.recognizeForVideo(video, nowInMs);
    }
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    const drawingUtils = new DrawingUtils(canvasCtx);
    canvasElement.style.height = videoHeight;
    webcamElement.style.height = videoHeight;
    canvasElement.style.width = videoWidth;
    webcamElement.style.width = videoWidth;
    if (results.landmarks) {
        for (const landmarks of results.landmarks) {
            drawingUtils.drawConnectors(landmarks, GestureRecognizer.HAND_CONNECTIONS, {
                color: "#00FF00",
                lineWidth: 5
            });
            drawingUtils.drawLandmarks(landmarks, {
                color: "#FF0000",
                lineWidth: 2
            });
        }
    }
    canvasCtx.restore();
    if (results.gestures.length > 0) {
        gestureOutput.style.display = "block";
        gestureOutput.style.width = videoWidth;
        const categoryName = results.gestures[0][0].categoryName;
        const categoryScore = parseFloat(results.gestures[0][0].score * 100).toFixed(2);
        const handedness = results.handednesses[0][0].displayName;
        gestureOutput.innerText = `GestureRecognizer: ${categoryName}\n Confidence: ${categoryScore} %\n Handedness: ${handedness}`;

        // Check for Open_Palm and Thumb_Up with confidence >= 0.50
        const MIN_CONFIDENCE = 0.50;
        const confidence = parseFloat(results.gestures[0][0].score);
        console.log('Gesture detected:', { categoryName, confidence, handedness });

        if (categoryName === "Open_Palm" && confidence >= MIN_CONFIDENCE) {
            console.log('Open_Palm detected, confidence:', confidence);
            if (!openPalmStartTime) {
                console.log('Starting Open_Palm timer');
                openPalmStartTime = Date.now();
            } else {
                const elapsedTime = Date.now() - openPalmStartTime;
                console.log('Open_Palm elapsed time:', elapsedTime);
                if (elapsedTime >= 2000 && !isPlaying) {
                    console.log('Playing critical alarm');
                    audio.play().catch(error => console.error('Audio play error:', error));
                    isPlaying = true;
                    openPalmStartTime = null;
                    setTimeout(() => {
                        audio.pause();
                        audio.currentTime = 0;
                        isPlaying = false;
                        console.log('Alarm stopped automatically');
                    }, 10000);
                }
            }
            thumbUpStartTime = null; // Reset Thumb_Up timer
        } else if (categoryName === "Thumb_Up" && confidence >= MIN_CONFIDENCE) {
            console.log('Thumb_Up detected, confidence:', confidence);
            if (!thumbUpStartTime) {
                console.log('Starting Thumb_Up timer');
                thumbUpStartTime = Date.now();
            } else {
                const elapsedTime = Date.now() - thumbUpStartTime;
                console.log('Thumb_Up elapsed time:', elapsedTime);
                if (elapsedTime >= 3000 && isPlaying) {
                    console.log('Stopping critical alarm due to Thumb_Up');
                    audio.pause();
                    audio.currentTime = 0;
                    isPlaying = false;
                    thumbUpStartTime = null;
                }
            }
            openPalmStartTime = null; // Reset Open_Palm timer
        } else {
            console.log('No Open_Palm or Thumb_Up, or low confidence:', { categoryName, confidence });
            openPalmStartTime = null;
            thumbUpStartTime = null;
        }
    } else {
        gestureOutput.style.display = "none";
        console.log('No gesture detected');
        openPalmStartTime = null;
        thumbUpStartTime = null;
    }
    if (webcamRunning === true) {
        window.requestAnimationFrame(predictWebcam);
    }
}


//working code 
// import { GestureRecognizer, FilesetResolver, DrawingUtils } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";

// const demosSection = document.getElementById("demos");
// let gestureRecognizer;
// let runningMode = "IMAGE";
// let enableWebcamButton;
// let webcamRunning = false;
// const videoHeight = "360px";
// const videoWidth = "480px";

// // Audio setup
// const audio = new Audio("/RJPOLICE_HACK_989_ItsSafeTech_3/hand-gesture/critical.mp3");
// audio.volume = 0.5;
// let isPlaying = false;
// let openPalmStartTime = null;

// const createGestureRecognizer = async () => {
//     const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm");
//     gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
//         baseOptions: {
//             modelAssetPath: "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
//             delegate: "GPU"
//         },
//         runningMode: runningMode
//     });
//     demosSection.classList.remove("invisible");
// };
// createGestureRecognizer();

// const imageContainers = document.getElementsByClassName("detectOnClick");
// for (let i = 0; i < imageContainers.length; i++) {
//     imageContainers[i].children[0].addEventListener("click", handleClick);
// }

// async function handleClick(event) {
//     if (!gestureRecognizer) {
//         alert("Please wait for gestureRecognizer to load");
//         return;
//     }
//     if (runningMode === "VIDEO") {
//         runningMode = "IMAGE";
//         await gestureRecognizer.setOptions({ runningMode: "IMAGE" });
//     }
//     const allCanvas = event.target.parentNode.getElementsByClassName("canvas");
//     for (var i = allCanvas.length - 1; i >= 0; i--) {
//         const n = allCanvas[i];
//         n.parentNode.removeChild(n);
//     }
//     const results = gestureRecognizer.recognize(event.target);
//     console.log(results);
//     if (results.gestures.length > 0) {
//         const p = event.target.parentNode.childNodes[3];
//         p.setAttribute("class", "info");
//         const categoryName = results.gestures[0][0].categoryName;
//         const categoryScore = parseFloat(results.gestures[0][0].score * 100).toFixed(2);
//         const handedness = results.handednesses[0][0].displayName;
//         p.innerText = `GestureRecognizer: ${categoryName}\n Confidence: ${categoryScore}%\n Handedness: ${handedness}`;
//         p.style =
//             "left: 0px;" +
//             "top: " +
//             event.target.height +
//             "px; " +
//             "width: " +
//             (event.target.width - 10) +
//             "px;";
//         const canvas = document.createElement("canvas");
//         canvas.setAttribute("class", "canvas");
//         canvas.setAttribute("width", event.target.naturalWidth + "px");
//         canvas.setAttribute("height", event.target.naturalHeight + "px");
//         canvas.style =
//             "left: 0px;" +
//             "top: 0px;" +
//             "width: " +
//             event.target.width +
//             "px;" +
//             "height: " +
//             event.target.height +
//             "px;";
//         event.target.parentNode.appendChild(canvas);
//         const canvasCtx = canvas.getContext("2d");
//         const drawingUtils = new DrawingUtils(canvasCtx);
//         for (const landmarks of results.landmarks) {
//             drawingUtils.drawConnectors(landmarks, GestureRecognizer.HAND_CONNECTIONS, {
//                 color: "#00FF00",
//                 lineWidth: 5
//             });
//             drawingUtils.drawLandmarks(landmarks, {
//                 color: "#FF0000",
//                 lineWidth: 1
//             });
//         }
//     }
// }

// const video = document.getElementById("webcam");
// const canvasElement = document.getElementById("output_canvas");
// const canvasCtx = canvasElement.getContext("2d");
// const gestureOutput = document.getElementById("gesture_output");

// function hasGetUserMedia() {
//     return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
// }

// if (hasGetUserMedia()) {
//     enableWebcamButton = document.getElementById("webcamButton");
//     enableWebcamButton.addEventListener("click", enableCam);
// } else {
//     console.warn("getUserMedia() is not supported by your browser");
// }

// function enableCam(event) {
//     if (!gestureRecognizer) {
//         alert("Please wait for gestureRecognizer to load");
//         return;
//     }
//     if (webcamRunning === true) {
//         webcamRunning = false;
//         enableWebcamButton.innerText = "ENABLE PREDICTIONS";
//         audio.pause();
//         isPlaying = false;
//         openPalmStartTime = null;
//     } else {
//         webcamRunning = true;
//         enableWebcamButton.innerText = "DISABLE PREDICTIONS";
//     }
//     const constraints = {
//         video: true
//     };
//     navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
//         video.srcObject = stream;
//         video.addEventListener("loadeddata", predictWebcam);
//     }).catch(error => console.error('Webcam error:', error));
// }

// let lastVideoTime = -1;
// let results = undefined;

// async function predictWebcam() {
//     const webcamElement = document.getElementById("webcam");
//     if (runningMode === "IMAGE") {
//         runningMode = "VIDEO";
//         await gestureRecognizer.setOptions({ runningMode: "VIDEO" });
//     }
//     let nowInMs = Date.now();
//     if (video.currentTime !== lastVideoTime) {
//         lastVideoTime = video.currentTime;
//         results = gestureRecognizer.recognizeForVideo(video, nowInMs);
//     }
//     canvasCtx.save();
//     canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
//     const drawingUtils = new DrawingUtils(canvasCtx);
//     canvasElement.style.height = videoHeight;
//     webcamElement.style.height = videoHeight;
//     canvasElement.style.width = videoWidth;
//     webcamElement.style.width = videoWidth;
//     if (results.landmarks) {
//         for (const landmarks of results.landmarks) {
//             drawingUtils.drawConnectors(landmarks, GestureRecognizer.HAND_CONNECTIONS, {
//                 color: "#00FF00",
//                 lineWidth: 5
//             });
//             drawingUtils.drawLandmarks(landmarks, {
//                 color: "#FF0000",
//                 lineWidth: 2
//             });
//         }
//     }
//     canvasCtx.restore();
//     if (results.gestures.length > 0) {
//         gestureOutput.style.display = "block";
//         gestureOutput.style.width = videoWidth;
//         const categoryName = results.gestures[0][0].categoryName;
//         const categoryScore = parseFloat(results.gestures[0][0].score * 100).toFixed(2);
//         const handedness = results.handednesses[0][0].displayName;
//         gestureOutput.innerText = `GestureRecognizer: ${categoryName}\n Confidence: ${categoryScore} %\n Handedness: ${handedness}`;

//         // Check for Open_Palm with confidence >= 0.50
//         const MIN_CONFIDENCE = 0.50;
//         const confidence = parseFloat(results.gestures[0][0].score);
//         console.log('Gesture detected:', { categoryName, confidence, handedness });
//         if (categoryName === "Open_Palm" && confidence >= MIN_CONFIDENCE) {
//             console.log('Open_Palm detected, confidence:', confidence);
//             if (!openPalmStartTime) {
//                 console.log('Starting timer');
//                 openPalmStartTime = Date.now();
//             } else {
//                 const elapsedTime = Date.now() - openPalmStartTime;
//                 console.log('Elapsed time:', elapsedTime);
//                 if (elapsedTime >= 5000 && !isPlaying) {
//                     console.log('Playing critical alarm');
//                     audio.play().catch(error => console.error('Audio play error:', error));
//                     isPlaying = true;
//                     openPalmStartTime = null;
//                     setTimeout(() => {
//                         audio.pause();
//                         audio.currentTime = 0;
//                         isPlaying = false;
//                         console.log('Alarm stopped');
//                     }, 10000);
//                 }
//             }
//         } else {
//             console.log('No Open_Palm or low confidence:', { categoryName, confidence });
//             openPalmStartTime = null;
//         }
//     } else {
//         gestureOutput.style.display = "none";
//         console.log('No gesture detected');
//         openPalmStartTime = null;
//     }
//     if (webcamRunning === true) {
//         window.requestAnimationFrame(predictWebcam);
//     }
// }

// import { GestureRecognizer, FilesetResolver, DrawingUtils } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";
// const demosSection = document.getElementById("demos");
// let gestureRecognizer;
// let runningMode = "IMAGE";
// let enableWebcamButton;
// let webcamRunning = false;
// const videoHeight = "360px";
// const videoWidth = "480px";

// const createGestureRecognizer = async () => {
//     const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm");
//     gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
//         baseOptions: {
//             modelAssetPath: "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
//             delegate: "GPU"
//         },
//         runningMode: runningMode
//     });
//     demosSection.classList.remove("invisible");
// };
// createGestureRecognizer();

// const imageContainers = document.getElementsByClassName("detectOnClick");
// for (let i = 0; i < imageContainers.length; i++) {
//     imageContainers[i].children[0].addEventListener("click", handleClick);
// }

// async function handleClick(event) {
//     if (!gestureRecognizer) {
//         alert("Please wait for gestureRecognizer to load");
//         return;
//     }
//     if (runningMode === "VIDEO") {
//         runningMode = "IMAGE";
//         await gestureRecognizer.setOptions({ runningMode: "IMAGE" });
//     }
//     const allCanvas = event.target.parentNode.getElementsByClassName("canvas");
//     for (var i = allCanvas.length - 1; i >= 0; i--) {
//         const n = allCanvas[i];
//         n.parentNode.removeChild(n);
//     }
//     const results = gestureRecognizer.recognize(event.target);
//     console.log(results);
//     if (results.gLiamestures.length > 0) {
//         const p = event.target.parentNode.childNodes[3];
//         p.setAttribute("class", "info");
//         const categoryName = results.gestures[0][0].categoryName;
//         const categoryScore = parseFloat(results.gestures[0][0].score * 100).toFixed(2);
//         const handedness = results.handednesses[0][0].displayName;
//         p.innerText = `GestureRecognizer: ${categoryName}\n Confidence: ${categoryScore}%\n Handedness: ${handedness}`;
//         p.style =
//             "left: 0px;" +
//             "top: " +
//             event.target.height +
//             "px; " +
//             "width: " +
//             (event.target.width - 10) +
//             "px;";
//         const canvas = document.createElement("canvas");
//         canvas.setAttribute("class", "canvas");
//         canvas.setAttribute("width", event.target.naturalWidth + "px");
//         canvas.setAttribute("height", event.target.naturalHeight + "px");
//         canvas.style =
//             "left: 0px;" +
//             "top: 0px;" +
//             "width: " +
//             event.target.width +
//             "px;" +
//             "height: " +
//             event.target.height +
//             "px;";
//         event.target.parentNode.appendChild(canvas);
//         const canvasCtx = canvas.getContext("2d");
//         const drawingUtils = new DrawingUtils(canvasCtx);
//         for (const landmarks of results.landmarks) {
//             drawingUtils.drawConnectors(landmarks, GestureRecognizer.HAND_CONNECTIONS, {
//                 color: "#00FF00",
//                 lineWidth: 5
//             });
//             drawingUtils.drawLandmarks(landmarks, {
//                 color: "#FF0000",
//                 lineWidth: 1
//             });
//         }
//     }
// }

// const video = document.getElementById("webcam");
// const canvasElement = document.getElementById("output_canvas");
// const canvasCtx = canvasElement.getContext("2d");
// const gestureOutput = document.getElementById("gesture_output");

// function hasGetUserMedia() {
//     return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
// }

// if (hasGetUserMedia()) {
//     enableWebcamButton = document.getElementById("webcamButton");
//     enableWebcamButton.addEventListener("click", enableCam);
// } else {
//     console.warn("getUserMedia() is not supported by your browser");
// }

// function enableCam(event) {
//     if (!gestureRecognizer) {
//         alert("Please wait for gestureRecognizer to load");
//         return;
//     }
//     if (webcamRunning === true) {
//         webcamRunning = false;
//         enableWebcamButton.innerText = "ENABLE PREDICTIONS";
//     } else {
//         webcamRunning = true;
//         enableWebcamButton.innerText = "DISABLE PREDICTIONS";
//     }
//     const constraints = {
//         video: true
//     };
//     navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
//         video.srcObject = stream;
//         video.addEventListener("loadeddata", predictWebcam);
//     });
// }

// let lastVideoTime = -1;
// let results = undefined;

// async function predictWebcam() {
//     const webcamElement = document.getElementById("webcam");
//     if (runningMode === "IMAGE") {
//         runningMode = "VIDEO";
//         await gestureRecognizer.setOptions({ runningMode: "VIDEO" });
//     }
//     let nowInMs = Date.now();
//     if (video.currentTime !== lastVideoTime) {
//         lastVideoTime = video.currentTime;
//         results = gestureRecognizer.recognizeForVideo(video, nowInMs);
//     }
//     canvasCtx.save();
//     canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
//     const drawingUtils = new DrawingUtils(canvasCtx);
//     canvasElement.style.height = videoHeight;
//     webcamElement.style.height = videoHeight;
//     canvasElement.style.width = videoWidth;
//     webcamElement.style.width = videoWidth;
//     if (results.landmarks) {
//         for (const landmarks of results.landmarks) {
//             drawingUtils.drawConnectors(landmarks, GestureRecognizer.HAND_CONNECTIONS, {
//                 color: "#00FF00",
//                 lineWidth: 5
//             });
//             drawingUtils.drawLandmarks(landmarks, {
//                 color: "#FF0000",
//                 lineWidth: 2
//             });
//         }
//     }
//     canvasCtx.restore();
//     if (results.gestures.length > 0) {
//         gestureOutput.style.display = "block";
//         gestureOutput.style.width = videoWidth;
//         const categoryName = results.gestures[0][0].categoryName;
//         const categoryScore = parseFloat(results.gestures[0][0].score * 100).toFixed(2);
//         const handedness = results.handednesses[0][0].displayName;
//         gestureOutput.innerText = `GestureRecognizer: ${categoryName}\n Confidence: ${categoryScore} %\n Handedness: ${handedness}`;

//         // Send gesture data to server
//         const gestureData = {
//             categoryName,
//             confidence: parseFloat(results.gestures[0][0].score),
//             handedness
//         };
//         console.log('Sending gesture:', gestureData);
//         fetch('http://127.0.0.1:5500/RJPOLICE_HACK_989_ItsSafeTech_3/hand-gesture/update-gesture', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(gestureData)
//         })
//             .then(() => console.log('Gesture sent successfully'))
//             .catch(error => console.error('Error sending gesture:', error));
//     } else {
//         gestureOutput.style.display = "none";
//     }
//     if (webcamRunning === true) {
//         window.requestAnimationFrame(predictWebcam);
//     }
// }


// import { GestureRecognizer, FilesetResolver, DrawingUtils } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";
// const demosSection = document.getElementById("demos");
// let gestureRecognizer;
// let runningMode = "IMAGE";
// let enableWebcamButton;
// let webcamRunning = false;
// const videoHeight = "360px";
// const videoWidth = "480px";

// const socket = new WebSocket('wss://broker.hivemq.com:8884/mqtt');

// socket.addEventListener('open', (event) => {
//    // Now you can send messages since the connection is open
   
// console.log("Socket open");

// socket.send("Hi")
// });



// socket.addEventListener('message', (event) => {
//     console.log('Message from server:', event.data);
// });

// socket.addEventListener('close', (event) => {
//     console.log("Socket closed", event);
// })

// const createGestureRecognizer = async () => {
//     const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm");
//     gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
//         baseOptions: {
//             modelAssetPath: "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
//             delegate: "GPU"
//         },
//         runningMode: runningMode
//     });
//     demosSection.classList.remove("invisible");
// };
// createGestureRecognizer();
// /********************************************************************
// // Demo 1: Detect hand gestures in images
// ********************************************************************/
// const imageContainers = document.getElementsByClassName("detectOnClick");
// for (let i = 0; i < imageContainers.length; i++) {
//     imageContainers[i].children[0].addEventListener("click", handleClick);
// }
// async function handleClick(event) {
//     if (!gestureRecognizer) {
//         alert("Please wait for gestureRecognizer to load");
//         return;
//     }
//     if (runningMode === "VIDEO") {
//         runningMode = "IMAGE";
//         await gestureRecognizer.setOptions({ runningMode: "IMAGE" });
//     }
//     // Remove all previous landmarks
//     const allCanvas = event.target.parentNode.getElementsByClassName("canvas");
//     for (var i = allCanvas.length - 1; i >= 0; i--) {
//         const n = allCanvas[i];
//         n.parentNode.removeChild(n);
//     }
//     const results = gestureRecognizer.recognize(event.target);
//     // View results in the console to see their format
//     console.log(results);
//     if (results.gestures.length > 0) {
//         const p = event.target.parentNode.childNodes[3];
//         p.setAttribute("class", "info");
//         const categoryName = results.gestures[0][0].categoryName;
//         const categoryScore = parseFloat(results.gestures[0][0].score * 100).toFixed(2);
//         const handedness = results.handednesses[0][0].displayName;
//         p.innerText = `GestureRecognizer: ${categoryName}\n Confidence: ${categoryScore}%\n Handedness: ${handedness}`;
//         p.style =
//             "left: 0px;" +
//                 "top: " +
//                 event.target.height +
//                 "px; " +
//                 "width: " +
//                 (event.target.width - 10) +
//                 "px;";
//         const canvas = document.createElement("canvas");
//         canvas.setAttribute("class", "canvas");
//         canvas.setAttribute("width", event.target.naturalWidth + "px");
//         canvas.setAttribute("height", event.target.naturalHeight + "px");
//         canvas.style =
//             "left: 0px;" +
//                 "top: 0px;" +
//                 "width: " +
//                 event.target.width +
//                 "px;" +
//                 "height: " +
//                 event.target.height +
//                 "px;";
//         event.target.parentNode.appendChild(canvas);
//         const canvasCtx = canvas.getContext("2d");
//         const drawingUtils = new DrawingUtils(canvasCtx);
//         for (const landmarks of results.landmarks) {
//             drawingUtils.drawConnectors(landmarks, GestureRecognizer.HAND_CONNECTIONS, {
//                 color: "#00FF00",
//                 lineWidth: 5
//             });
//             drawingUtils.drawLandmarks(landmarks, {
//                 color: "#FF0000",
//                 lineWidth: 1
//             });
//         }
//     }
// }
// /********************************************************************
// // Demo 2: Continuously grab image from webcam stream and detect it.
// ********************************************************************/
// const video = document.getElementById("webcam");
// const canvasElement = document.getElementById("output_canvas");
// const canvasCtx = canvasElement.getContext("2d");
// const gestureOutput = document.getElementById("gesture_output");
// // Check if webcam access is supported.
// function hasGetUserMedia() {
//     return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
// }
// // If webcam supported, add event listener to button for when user
// // wants to activate it.
// if (hasGetUserMedia()) {
//     enableWebcamButton = document.getElementById("webcamButton");
//     enableWebcamButton.addEventListener("click", enableCam);
// }
// else {
//     console.warn("getUserMedia() is not supported by your browser");
// }
// // Enable the live webcam view and start detection.
// function enableCam(event) {
//     if (!gestureRecognizer) {
//         alert("Please wait for gestureRecognizer to load");
//         return;
//     }
//     if (webcamRunning === true) {
//         webcamRunning = false;
//         enableWebcamButton.innerText = "ENABLE PREDICTIONS";
//     }
//     else {
//         webcamRunning = true;
//         enableWebcamButton.innerText = "DISABLE PREDICTIONS";
//     }
//     // getUsermedia parameters.
//     const constraints = {
//         video: true
//     };
//     // Activate the webcam stream.
//     navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
//         video.srcObject = stream;
//         video.addEventListener("loadeddata", predictWebcam);
//     });
// }
// let lastVideoTime = -1;
// let results = undefined;
// async function predictWebcam() {
//     const webcamElement = document.getElementById("webcam");
//     // Now let's start detecting the stream.
//     if (runningMode === "IMAGE") {
//         runningMode = "VIDEO";
//         await gestureRecognizer.setOptions({ runningMode: "VIDEO" });
//     }
//     let nowInMs = Date.now();
//     if (video.currentTime !== lastVideoTime) {
//         lastVideoTime = video.currentTime;
//         results = gestureRecognizer.recognizeForVideo(video, nowInMs);
//     }
//     canvasCtx.save();
//     canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
//     const drawingUtils = new DrawingUtils(canvasCtx);
//     canvasElement.style.height = videoHeight;
//     webcamElement.style.height = videoHeight;
//     canvasElement.style.width = videoWidth;
//     webcamElement.style.width = videoWidth;
//     if (results.landmarks) {
//         for (const landmarks of results.landmarks) {
//             drawingUtils.drawConnectors(landmarks, GestureRecognizer.HAND_CONNECTIONS, {
//                 color: "#00FF00",
//                 lineWidth: 5
//             });
//             drawingUtils.drawLandmarks(landmarks, {
//                 color: "#FF0000",
//                 lineWidth: 2
//             });
//         }
//     }
//     canvasCtx.restore();
//     if (results.gestures.length > 0) {
//         gestureOutput.style.display = "block";
//         gestureOutput.style.width = videoWidth;
//         const categoryName = results.gestures[0][0].categoryName;
//         const categoryScore = parseFloat(results.gestures[0][0].score * 100).toFixed(2);
//         const handedness = results.handednesses[0][0].displayName;
//         gestureOutput.innerText = `GestureRecognizer: ${categoryName}\n Confidence: ${categoryScore} %\n Handedness: ${handedness}`;
//     }
//     else {
//         gestureOutput.style.display = "none";
//     }
//     // Call this function again to keep predicting when the browser is ready.
//     if (webcamRunning === true) {
//         window.requestAnimationFrame(predictWebcam);
//     }

  
//     if (results.gestures.length > 0) {
//         const categoryName = results.gestures[0][0].categoryName;
//         const categoryScore = parseFloat(results.gestures[0][0].score * 100).toFixed(2);
//         const handedness = results.handednesses[0][0].displayName;
    
//         gestureOutput.style.display = "block";
//         gestureOutput.style.width = videoWidth;
    
//         // Show gesture information in the output element.
//         gestureOutput.innerText = `GestureRecognizer: ${categoryName}\n Confidence: ${categoryScore} %\n Handedness: ${handedness}`;
    
//         // Check for a closed fist gesture.
        
//         if (categoryName === "Pointing_Up") {
//             // Set a timer to show the alert box after 5 seconds.
        
                
            
            
//         }

//     } else {
//         gestureOutput.style.display = "none";
//     }

// }

// "use client";

// import { useEffect, useRef, useState } from "react";
// import Script from "next/script";

// export default function HandGestureRecognizerWidget() {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const gestureOutputRef = useRef(null);
//   const [gestureRecognizer, setGestureRecognizer] = useState(null);
//   const [webcamRunning, setWebcamRunning] = useState(false);
//   const [gestureOutput, setGestureOutput] = useState("");
//   const [error, setError] = useState(null);
//   const runningModeRef = useRef("IMAGE");
//   const lastVideoTimeRef = useRef(-1);
//   const videoHeight = "360px";
//   const videoWidth = "480px";

//   // Initialize GestureRecognizer after MediaPipe script loads
//   useEffect(() => {
//     if (!window.GestureRecognizer || !window.FilesetResolver || !window.DrawingUtils) return;

//     const createGestureRecognizer = async () => {
//       try {
//         const vision = await window.FilesetResolver.forVisionTasks(
//           "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304/wasm"
//         );
//         const recognizer = await window.GestureRecognizer.createFromOptions(vision, {
//           baseOptions: {
//             modelAssetPath: "/models/gesture_recognizer.task", // Ensure this file is in public/models/
//             delegate: "GPU",
//           },
//           runningMode: runningModeRef.current,
//         });
//         setGestureRecognizer(recognizer);
//       } catch (err) {
//         setError(`Failed to initialize GestureRecognizer: ${err.message}`);
//       }
//     };

//     createGestureRecognizer();
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
//       }).catch((err) => {
//         setError(`Failed to access webcam: ${err.message}`);
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
//   }, [webcamRunning, gestureRecognizer]);

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
//       const drawingUtils = new window.DrawingUtils(canvasCtx);
//       canvas.style.height = videoHeight;
//       video.style.height = videoHeight;
//       canvas.style.width = videoWidth;
//       video.style.width = videoWidth;

//       if (results.landmarks) {
//         for (const landmarks of results.landmarks) {
//           drawingUtils.drawConnectors(landmarks, window.GestureRecognizer.HAND_CONNECTIONS, {
//             color: "#00FF00",
//             lineWidth: 5,
//           });
//           drawingUtils.drawLandmarks(landmarks, {
//             color: "#FF0000",
//             lineWidth: 2,
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

//   if (error) {
//     return <div style={{ color: "red", padding: "20px" }}>Error: {error}</div>;
//   }

//   return (
//     <>
//       {/* Load MediaPipe script */}
//       <Script
//         src="https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304"
//         strategy="beforeInteractive"
//         onLoad={() => {
//           console.log("MediaPipe script loaded");
//         }}
//         onError={() => {
//           setError("Failed to load MediaPipe script. Please check your network or the CDN URL.");
//         }}
//       />

//       {/* Material Components */}
//       <link
//         href="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css"
//         rel="stylesheet"
//       />
//       <Script
//         src="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.js"
//         strategy="lazyOnload"
//       />

//       {/* Styles */}
//       <style>{`
//         @import url('https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap');
//         body {
//           font-family: roboto, Arial, sans-serif;
//           margin: 2em;
//           color: #3d3d3d;
//           --mdc-theme-primary: #000000;
//           --mdc-theme-on-primary: #f1f3f4;
//         }
//         .videoView {
//           position: absolute;
//           float: left;
//           width: 48%;
//           margin: 2% 1%;
//           cursor: pointer;
//           min-height: 500px;
//         }
//         .output {
//           display: ${gestureOutput ? "block" : "none"};
//           width: 100%;
//           font-size: calc(8px + 1.2vw);
//         }
//         .mdc-button.mdc-button--raised {
//           background: #000;
//           color: #f1f3f4;
//           font-weight: bold;
//         }
//       `}</style>

//       {/* Widget UI */}
//       <div id="liveView" className="videoView">
//         <button className="mdc-button mdc-button--raised" onClick={enableCam}>
//           <span className="mdc-button__ripple"></span>
//           <span className="mdc-button__label">{webcamRunning ? "DISABLE PREDICTIONS" : "ENABLE WEBCAM"}</span>
//         </button>
//         <div style={{ position: "relative" }}>
//           <video ref={videoRef} autoPlay playsInline />
//           <canvas ref={canvasRef} className="output_canvas" width="1280" height="720" style={{ position: "absolute", left: 0, top: 0 }} />
//           <p ref={gestureOutputRef} className="output" style={{ width: videoWidth }}>{gestureOutput}</p>
//         </div>
//       </div>
//     </>
//   );
// }