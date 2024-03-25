import React from 'react'
import Image from 'next/image'
import dp from "../../public/dp.jpg"
import Link from 'next/link'
type Props = {}

function ProfileLink({ }: Props) {
    return (
        <div className='w-full p-4 flex justify-end'>
            <Link href="/profile">
                <div className='bg-white rounded-full p-2 hover:bg-gray-100'>
                    <Image width={40} className="h-[32px] w-[32px] rounded-full" src={dp} alt="Dp" />
                </div>

            </Link>
        </div>
    )
}

export default ProfileLink