'use client'
import { useParams } from 'next/navigation'
// import { useSession } from 'next-auth/react'
import React from 'react'
// useParams
const PublicMessagePage = () => {
  // const { data: session } = useSession()
  // const username = session?.user?.username || 'guest'
  const params = useParams()
  const username = params.username || 'guest'
  return (
    <div>anonymous PublicMessagePage for message <strong>@{username}</strong></div>
  )
}

export default PublicMessagePage