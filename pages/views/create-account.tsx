import React, { useContext, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'
import { GithubIcon, TwitterIcon } from 'icons'
import { Input, Label, Button, WindmillContext } from '@roketid/windmill-react-ui'

function CrateAccount() {
  const { mode } = useContext(WindmillContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [checked, setChecked] = useState(false)

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const res = await axios.post('/api/user', {
      email: email,
      password: password,
    })
    if(res.status === 201){
      alert('회원가입 성공')
      location.href = '/login'
    }
  }

  const imgSource = mode === 'dark' ? '/assets/img/create-account-office-dark.jpeg' : '/assets/img/create-account-office.jpeg'


  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="relative h-32 md:h-auto md:w-1/2">
            <Image
              aria-hidden="true"
              className="object-cover w-full h-full"
              src={imgSource}
              alt="Office"
              layout='fill'
            />
          </div>
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                Create account
              </h1>
              <Label>
                <span>Email</span>
                <Input className="mt-1" type="email" placeholder="john@doe.com" value={email} onChange={onChangeEmail}/>
              </Label>
              <Label className="mt-4">
                <span>Password</span>
                <Input className="mt-1" placeholder="***************" type="password" value={password} onChange={onChangePassword}/>
              </Label>
              <Label className="mt-4">
                <span>Confirm password</span>
                <Input className="mt-1" placeholder="***************" type="password" />
              </Label>

              <Label className="mt-6" check>
                <Input type="checkbox" />
                <span className="ml-2">
                  I agree to the <span className="underline">privacy policy</span>
                </span>
              </Label>

                <Button block className="mt-4" onClick={handleSubmit}>
                  Create account
                </Button>

              <hr className="my-8" />

              <p className="mt-4">
                <Link href="/login">
                  <a
                    className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    Already have an account? Login
                  </a>
                </Link>
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default CrateAccount
