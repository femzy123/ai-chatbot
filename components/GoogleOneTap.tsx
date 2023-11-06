'use client'

import { useEffect, useState } from 'react'
// import { useGoogleOneTapLogin } from 'react-google-one-tap-login';
import { IGoogleEndPointResponse } from '@/lib/googleOneTapLogin/types'
import { signIn } from 'next-auth/react'
import { useGoogleOneTapLogin } from '@/lib/googleOneTapLogin'

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''

function GoogleOneTap() {
  const [user, setUser] = useState<IGoogleEndPointResponse | null>(null)
  const [isLogin, setIsLogin] = useState(false)
  const [loading, setLoading] = useState(false)

  useGoogleOneTapLogin({
    onSuccess: async (response: IGoogleEndPointResponse) => {
      console.log(response)
      setUser(response)
      setIsLogin(true)
      setLoading(true)

      // This signs the user in with next-auth
      const result = await signIn('credentials', {
        redirect: true,
        id: response.kid,
        email: response.email,
        name: response.name,
        picture: response.picture,
        callbackUrl: '/'
      })

      if (result?.error) {
        console.log(result?.error)
      } else {
        setIsLogin(true)
      }
    },
    onError: error => {
      console.log(error)
    },
    googleAccountConfigs: {
      client_id: clientId
    },
    disabled: isLogin
  })

  return (
    <div className="">
      {/* {!user ? (<p>Please Login</p>) : (<p>Welcome, {user.name}</p>)} */}
      {!loading ? (
        <p>Please Login</p>
      ) : (
        <div className="h-12 w-12 animate-spin-scale rounded-full border border-white bg-transparent shadow-lg"></div>
      )}
    </div>
  )
}

export default GoogleOneTap
