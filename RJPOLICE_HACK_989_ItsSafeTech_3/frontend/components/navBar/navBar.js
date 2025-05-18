import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import logo from '../../public/logo.png'

function navBar() {
  return (
    <div className='navBar'>
        <div className="logo">
            <Image className='logo' src={logo} alt=''/>
        </div>

        <div className="linksDiv">
            <Link href="/"><div className="link">Home</div></Link>
            <Link href="/riskyItems"><div className="link">Risky Items</div></Link>
            <Link href="/riskyMovements"><div className="link">Risky Movements</div></Link>
            <Link href="/faceRecognition"><div className="link">Face Recognition</div></Link>
            <Link href="/alerts"><div className="link">Alerts</div></Link>
            <Link href="/hg"><div className="link">Hand Gesture</div></Link>

        </div>
    </div>
  )
}

export default navBar