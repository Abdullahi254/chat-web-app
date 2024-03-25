import React from 'react'
import hero from "../../public/hero.svg"
import ProfileLink from './ProfileLink'
type Props = {}

const BlankScreen = (props: Props) => {
  return (
    <div className="pattern h-full w-full">
      <ProfileLink/>
    </div>
  )
}

export default BlankScreen