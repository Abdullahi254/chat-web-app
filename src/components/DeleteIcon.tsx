"use client"
import React from 'react'
import { deleteGroup } from '@/lib/actions';
import { MdDelete } from "react-icons/md";
type Props = {
    groupId: string
    userId: string
}

const DeleteIcon = ({groupId, userId}: Props) => {
  return (
    <span className='cursor-pointer hover:text-red-500' onClick={()=>deleteGroup(groupId, userId)}><MdDelete /></span>
  )
}

export default DeleteIcon