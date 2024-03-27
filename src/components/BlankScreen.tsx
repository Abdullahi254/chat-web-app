import React from 'react'
import ProfileLink from './ProfileLink'
type Props = {
  userId: string
}

const BlankScreen = ({
  userId
}: Props) => {
  return (
    <div className="pattern h-full w-full">
      <div className='w-full p-4 flex justify-end'>
        <ProfileLink userId={userId} />
      </div>
    </div>
  )
}

export default BlankScreen