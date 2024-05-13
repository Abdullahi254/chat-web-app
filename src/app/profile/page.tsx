import ProfileCard from '@/components/ProfileCard'
import { getUserId } from '@/app/page';
import React from 'react'

type Props = {
    params: {
        id: string
    }
}

async function page({ params}: Props) {
    const userId = await getUserId();
    return (
        <main className="h-screen py-10 px-6 pattern w-full">
            <ProfileCard profileId={params.id}/>
        </main>
    )
}

export default page