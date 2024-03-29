import React, { useContext } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'
import { Label, Input, Button, WindmillContext } from '@roketid/windmill-react-ui'

function LoginPage() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const onEmailChange = (e) =>{
    setEmail(e.target.value)
  }
  const onPasswordChange = (e) =>{
    setPassword(e.target.value)
  }

  const handleSubmit = async (e)=>{
    e.preventDefault();
    const data = {email,password}
    const res = await axios.post("/api/auth",data);
    if(res.status===201){
      return window.location.href="/dashboard"
    }
    return location.reload()
  }

  const { mode } = useContext(WindmillContext)
  const imgSource =  '/assets/img/logo.png'

  return (
    <div className='flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900'>
      <div className='flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800'>
        <div className='flex flex-col overflow-y-auto md:flex-row'>
          <div className='relative h-32 md:h-auto md:w-1/2'>
            <Image
              aria-hidden='true'
              className='hidden object-cover w-full h-full'
              src={imgSource}
              alt='Office'
              layout='fill'
            />
          </div>
          <main className='flex items-center justify-center p-6 sm:p-12 md:w-1/2'>
            <div className='w-full'>
              <h1 className='mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200'>
                로그인
              </h1>
              <Label>
                <span>이메일</span>
                <Input
                  className='mt-1'
                  type='email'
                  placeholder='john@doe.com'
                  value = {email}
                  onChange={onEmailChange}

                />
              </Label>

              <Label className='mt-4'>
                <span>패스워드</span>
                <Input
                  className='mt-1'
                  type='password'
                  placeholder='***************'
                  value = {password}
                  onChange={onPasswordChange}
                />
              </Label>

              {/* <Link href='/dashboard' passHref={true}> */}
                <Button className='mt-4' block onClick={handleSubmit}>
                  Log in
                </Button>
              {/* </Link> */}

              <hr className='my-8' />

              {/* <p className='mt-4'>
                <Link href='/example/forgot-password'>
                  <a className='text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline'>
                    Forgot your password?
                  </a>
                </Link>
              </p> */}
              <p className='mt-1'>
                <Link href='/create-account'>
                  <a className='text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline'>
                    계정 생성
                  </a>
                </Link>
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default LoginPage
