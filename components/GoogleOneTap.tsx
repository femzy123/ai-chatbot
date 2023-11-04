'use client'

import { useEffect, useState } from 'react';
import { useGoogleOneTapLogin } from 'react-google-one-tap-login';
import { IGoogleEndPointResponse } from 'react-google-one-tap-login/dist/types/types';

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''


function GoogleOneTap() {
  const [user, setUser] = useState<IGoogleEndPointResponse | null>(null)
  const [isLogin, setIsLogin] = useState(false)

  useGoogleOneTapLogin({
    onSuccess: (response: IGoogleEndPointResponse) => {
      setUser(response)
      setIsLogin(true)
    },
    onError: (error) => {
      console.log(error);
    },
    googleAccountConfigs: {
      client_id: clientId
    },
    disabled: isLogin
  })

  return (
    <div className=''>
      {!user ? (<p>Please Login</p>) : (<p>Welcome, {user.name}</p>)}
    </div>
  )
}

export default GoogleOneTap;
