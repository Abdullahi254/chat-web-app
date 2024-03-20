'use server'

import { redirect, RedirectType } from 'next/navigation'
import { cookies } from 'next/headers'

export const handleLogin = async (_currentState: unknown, formData: FormData) => {
        const userData = {
            email: formData.get('email'),
            password: formData.get('password'),
        }

        try {
            const results = await fetch(process.env.REACT_APP_BASE_URL + '/login', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData)
            })
            const response = await results.json()
            if (results.ok) {
                if (response.token) {
                    cookies().set('x-token', response.token, {
                      httpOnly: true,
                      secure: process.env.NODE_ENV === 'production',
                      maxAge: 60 * 60 * 24 * 7, // One week
                      path: '/',
                    })
                    console.log('successfully logged in')
                    redirect('/', RedirectType.replace) ;
                }
            } 
            return response
        } catch (error) {
            console.log(error)
            throw error
        }
}

export const handleRegistration = async(_currentState: unknown, formData: FormData) => {
    const userData = {
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('password2'),
    }

    if (userData.password !== userData.confirmPassword) {
        return "passwords do not match"
    }   

    try {
        const results = await fetch(process.env.REACT_APP_BASE_URL + '/register', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email: userData.email, password: userData.password})
        })
        const response = await results.json()

        if (results.ok) {
            cookies().set('session', btoa(response.username), {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7, // One week
                path: '/',
              })
            redirect('/login')
        }

        return response
    }  catch(error) {
        console.log(error)
        throw error
    }
}