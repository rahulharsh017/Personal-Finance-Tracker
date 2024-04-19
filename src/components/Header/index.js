import React from 'react'
import './style.css'

function Header() {
    
    function logoutFnc(){
        alert('You have been logged out');
    }
  
    return (
    <div className='navbar'>
        <p className='logo'>FinTrack</p>
        <p className='logo link' onClick={logoutFnc}>Logout</p>
    </div>
  )
}

export default Header