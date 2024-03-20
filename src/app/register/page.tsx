import React, {useState} from 'react'

type Props = {}

const page = (props: Props) => {
    // const [error, setrror] = useState('')

    async function handleRegistration(formData: FormData) {
        'use server'
        const userData = {
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('password2'),
        }
        if (userData.password !== userData.confirmPassword) {
            console.log("passwords do not match")
            return 
        }        

        try {
            const results = await fetch(process.env.BASE_URL + "/register", {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(userData)
            })
            const row = await results.json()

            if (results.status !== 201) {
                console.log(row)
            }
        }  catch(error) {
            console.log(error)
        }
    }

    return (
        <main className="flex flex-col space-y-4 min-h-screen items-center py-20 px-6 max-w-4xl mx-auto">
            <div className='flex px-2 w-[65%]'>
                <h1 className='text-left font-semibold text-xl md:text-2xl'>Register</h1>
            </div>
            <form className="space-y-4 md:space-y-6 bg-white rounded-md p-4 w-[65%]" action={handleRegistration} >
                <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                    <input name="email" id="email" type='email' className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="Email" required />
                </div>
                <div>
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                    <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required />
                </div>
                <div>
                    <label htmlFor="password2" className="block mb-2 text-sm font-medium text-gray-900">Confirm Password</label>
                    <input type="password2" name="password2" id="password2" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required />
                </div>
                <button type="submit" className="w-full text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Register</button>
            </form>
            
        </main>
    )
}

export default page