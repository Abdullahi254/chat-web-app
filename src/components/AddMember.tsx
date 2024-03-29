"use client"
import { handleAddMember,  } from '@/lib/actions';
import React, { ChangeEvent,useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom';
import { IoIosAdd } from "react-icons/io";


type Props = {
    userId: string
    chatId: string
}

type Suggestion = {
    name: string
    _id: string
}

const AddMember = ({
    userId,
    chatId
}: Props) => {
    const [search, setSearch] = useState<boolean>(false)
    const [inputValue, setInputValue] = useState<string>('')
    const [suggestions, setSuggestions] = useState<Suggestion[]>();
    const [selectedFriend, setSelectedFriend] = useState<Suggestion>();
    const [errorMessage, dispatch] = useFormState(handleAddMember, undefined)


    const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target
        setInputValue(value);
        if (value.length > 0) {
            const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/search/${value.toLowerCase()}/${userId}`)
            if (!res.ok) {
                throw new Error('Failed to fetch data')
            }
            const results: Suggestion[] = await res.json()
            setSuggestions(results);
        }
        else {
            setSuggestions(undefined)
        }
    };

    const handleSelectSuggestion = (suggestion: Suggestion) => {
        setInputValue(suggestion.name);
        setSelectedFriend(suggestion)
        setSuggestions(undefined);
    };
    return (
        <>
            {
                search ?

                    <div>
                        <form className="flex items-center max-w-sm mx-auto px-2" action={dispatch}>
                            <label htmlFor="Create" className="sr-only">Create</label>
                            <div className="relative w-full">
                                <input type="text" id="search" name="search" onChange={handleChange} value={inputValue} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full ps-10 p-2.5" placeholder="Enter name..." />
                                <input type="text" id="chatId" name="chatId" defaultValue={chatId} hidden />
                                <input type="text" id="friendId" name="friendId" defaultValue={selectedFriend?._id} hidden />
                            </div>
                            <AddMemberButton />
                        </form>
                        {
                            inputValue.length > 0 && suggestions &&
                            <ul className='items-center max-w-sm mx-auto px-2 p-4 bg-gray-100 mt-2 space-y-4 rounded-lg'>
                                {suggestions?.slice(0, 5).map((suggestion, index) => (
                                    <li key={index} onClick={() => handleSelectSuggestion(suggestion)} className='cursor-pointer hover:bg-gray-200 py-2 px-4 rounded-lg text-sm'>
                                        {suggestion.name}
                                    </li>
                                ))}
                            </ul>
                        }

                        {
                            !errorMessage?.isError && <p className='py-2 w-full text-center text-xs tracking-wide text-green-500'>{errorMessage?.message}</p>
                        }
                        {
                            errorMessage?.isError && <p className=' py-2 w-full text-center text-xs tracking-wide text-red-500'>{errorMessage?.message}</p>
                        }
                    </div>

                    :
                    <div className='w-full flex py-4 px-2 space-x-4 items-center'>
                        <button id='add' className='text-lg p-2 rounded-full bg-gray-50 cursor-pointer' onClick={() => setSearch(true)}>
                            <IoIosAdd />
                        </button>
                    </div>


            }

        </>
    )
}
function AddMemberButton() {
    const { pending } = useFormStatus()

    return (
        <button aria-disabled={pending} type="submit" className="p-2.5 ms-2 text-xs font-medium text-white bg-gray-700 rounded-lg border border-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300">
            submit
        </button>
    )
}
export default AddMember