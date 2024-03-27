import React from 'react'
import Image from 'next/image'
import dp from "../../public/dp.jpg"
import Link from 'next/link'
type Props = {
    userId: string
}

function ProfileLink({ userId}: Props) {
    return (
        <div>
            <Link href={`/profile/${userId}`}>
                <div className='bg-white rounded-full p-2 hover:bg-gray-100'>
                    <Image width={40} className="h-[32px] w-[32px] rounded-full" src={dp} alt="Dp" />
                </div>

            </Link>
        </div>
    )
}

export default ProfileLink