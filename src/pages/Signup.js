import React from 'react'
import Header from '../components/Header'
import SignUpSigninComponent from '../components/SignUpSignin'

function Signup() {
  return (
    <div>
      <Header />
      <div className='wrapper'>
        <SignUpSigninComponent />
      </div>
    </div>
  )
}

export default Signup