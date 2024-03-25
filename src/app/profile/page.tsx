import ProfileCard from '@/components/ProfileCard'
import React from 'react'

type Props = {}

function page({ }: Props) {
    return (
        <main className="h-screen py-10 px-6 pattern w-full">
            <ProfileCard/>
        </main>
    )
}

export default page