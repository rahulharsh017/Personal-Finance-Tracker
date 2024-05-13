import React, { useEffect } from 'react'
import './style.css'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { auth } from '../../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { signOut } from 'firebase/auth'
import userImg from '../../assets/user.svg'

function Header() {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate()

    useEffect(() => {
        if(user){
            navigate('/dashboard')
        }
    }, [user, loading,navigate])

    function logoutFnc(){
        try {
            signOut(auth).then(() => {
                toast.success("Logged Out successful")
                navigate('/')
              }).catch((error) => {
                toast.error(error.message)
              });
        } catch (e) {
            toast.error("e.message")
            
        }
        
    }
  
    return (
    <div className='navbar'>
        <p className='logo'>FinTrack</p>
        {user && (
            <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
            }}
            > 
            <img
            src={user.photoURL ? user.photoURL : userImg}
            alt='user-img'
            style={{
                borderRadius: '50%',
                height: '2rem',
                width: '2rem'
            }}
            />
            <p className='logo link' onClick={logoutFnc}>Logout</p>
            </div>
        )}
        
    </div>
  )
}

export default Header