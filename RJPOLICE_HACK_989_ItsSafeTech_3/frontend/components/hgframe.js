'use client';

// A simple React component to embed the local HTML page via iframe
export default function HandGestureIframe() {
  return (
    <div style={{width: "100%", height: "900px", border: "1px solid #ccc"}}>
      <iframe
        src="http://127.0.0.1:5500/RJPOLICE_HACK_989_ItsSafeTech_3/hand-gesture/index.html"
        width="100%"
        height="100%"
        style={{border: "none"}}
        title="Hand Gesture Demo"
        allow="camera; microphone"
      />
    </div>
  );
}