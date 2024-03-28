"use client"
import React, {ChangeEvent, useState } from 'react'
import { IoIosAdd } from "react-icons/io";
type Props = {
    userId: string
}

const AddMember = ({
    userId
}: Props) => {
    const [search, setSearch] = useState<boolean>(false)
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);

    const handleAddMember = (e)=>{
        
    }

    const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target
        setInputValue(value);

        // Implement your logic to fetch suggestions based on the input value
        // For example, you can fetch suggestions from an API
        // For now, we'll use a simple static list
        const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/search/${value.toLowerCase()}`)
        if (!res.ok) {
            throw new Error('Failed to fetch data')
        }
        const results: {name: string, _id: string}[] = await res.json()
        console.log(results)
        const suggestions = results.map(suggestion => suggestion.name);
        setSuggestions(suggestions);
    };

    const handleSelectSuggestion = (suggestion: string) => {
        setInputValue(suggestion);
        setSuggestions([]);
    };

  return (
    <>
    {
        search ?
            <div>
                <form className="flex items-center max-w-sm mx-auto px-2" onSubmit={handleAddMember}>
                    <label htmlFor="Create" className="sr-only">Create</label>
                    <div className="relative w-full">
                        <input type="text" id="search" name="search" onChange={handleChange} value={inputValue} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full ps-10 p-2.5" placeholder="Enter name..."/>
                    </div>
                    <button type="submit" className="p-2.5 ms-2 text-xs font-medium text-white bg-gray-700 rounded-lg border border-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300">
                        submit
                    </button>
                </form>
                <ul className='items-center max-w-sm mx-auto px-2'>
                {suggestions.map((suggestion, index) => (
                    <li key={index} onClick={() => handleSelectSuggestion(suggestion)}>
                        {suggestion}
                    </li>
                ))}
            </ul>
            </div>
             :
            <div className='w-full flex py-4 px-2 space-x-4 items-center'>
                <button id='add' className='text-lg p-2 rounded-full bg-gray-50 cursor-pointer' onClick={()=>setSearch(true)}>
                    <IoIosAdd />
                </button>
            </div>
    }

</>
  )
}

export default AddMember