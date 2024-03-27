import ProfileCard from '@/components/ProfileCard'
import React from 'react'

type Props = {
    params: {
        id: string
    }
}

function page({ params}: Props) {
    return (
        <main className="h-screen py-10 px-6 pattern w-full">
            <ProfileCard profileId={params.id}/>
        </main>
    )
}

export default page