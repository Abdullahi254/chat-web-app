'use client'

import { handleLogin } from '@/lib/actions'
import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom'
import { FaRegEyeSlash } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";


const Page = () => {
    const [errorMessage, dispatch] = useFormState(handleLogin, undefined)
    const [show, setShow] = useState<boolean>(false)
    return (
        <main className="flex flex-col space-y-4 min-h-screen items-center py-20 px-6 max-w-4xl mx-auto">
            <div className='flex px-2 w-[65%]'>
                <h1 className='text-left font-semibold text-xl md:text-2xl'>Login</h1>
            </div>
            <form className="space-y-4 md:space-y-6 bg-white rounded-md p-4 w-[65%]" action={dispatch}>
                <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                    <input name="email" id="email" type='email' className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="Email" required />
                </div>
                <div className='relative'>
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                    <input type={show ? "text" : "password"} name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required />
                    {
                        show ? <IoEyeSharp className='absolute right-3 top-10 cursor-pointer' onClick={() => setShow(prev => !prev)} /> :
                            <FaRegEyeSlash className='absolute right-3 top-10 cursor-pointer' onClick={() => setShow(prev => !prev)} />
                    }
                </div>
                <div>{errorMessage && <p className='text-sm font-medium text-red-500'>{errorMessage}</p>}</div>
                <LoginButton />
            </form>
        </main>
    )
}

function LoginButton() {
    const { pending } = useFormStatus()
   
    return (
        <button aria-disabled={pending} type="submit" className="w-full text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Sign in</button>
    )
}

export default Page
