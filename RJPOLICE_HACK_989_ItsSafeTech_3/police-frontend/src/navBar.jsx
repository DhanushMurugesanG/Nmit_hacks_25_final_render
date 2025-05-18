import React from 'react'
import logo from './assets/logo.png'

function navBar() {
  return (
    <div className='navBar'>
        <div className="logo">
            <img className='logo' src={logo} alt=''/>
        </div>

        {/* <div className="linksDiv">
            <a href="/"><div className="link">Home</div></a>
            <a href="/weaponDetection"><div className="link">Risky Items</div></a>
            <a href="/riskyMovements"><div className="link">Risky Movements</div></a>
            <a href="/faceRecognition"><div className="link">Face Recognition</div></a>
            <div className="link">Alerts</div>
        </div> */}
    </div>
  )
}

export default navBar