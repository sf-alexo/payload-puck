'use client'

import React from 'react'
import { useAuth, useConfig } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'

export const LogoutButton: React.FC = () => {
  const { user, logOut } = useAuth()
  const router = useRouter()
  const {
    config: {
      routes: { admin: adminRoute },
    },
  } = useConfig()

  if (!user) return null

  const handleLogout = async () => {
    await logOut()
    router.push(`${adminRoute}/login`)
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      style={{
        cursor: 'pointer',
        background: 'transparent',
        border: '1px solid var(--theme-elevation-150)',
        borderRadius: 'var(--style-radius-s, 4px)',
        color: 'var(--theme-text)',
        padding: '6px 12px',
        fontSize: '0.85rem',
        lineHeight: 1,
        whiteSpace: 'nowrap',
      }}
    >
      Log out
    </button>
  )
}

export default LogoutButton
