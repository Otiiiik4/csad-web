'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function RealtimeSync({ tables }: { tables: string[] }) {
  const router = useRouter()

  useEffect(() => {
    // Register PWA Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(err => console.error('SW reg failed', err))
    }

    // Create a subscription channel for each specified table
    const channels = tables.map(table => 
      supabase.channel(`public:${table}`)
        .on('postgres_changes', { event: '*', schema: 'public', table }, () => {
          // When database changes, refresh the current route (server components re-fetch automatically)
          router.refresh()
        })
        .subscribe()
    )

    return () => {
      // Cleanup subscriptions on unmount
      channels.forEach(ch => supabase.removeChannel(ch))
    }
  }, [tables, router])

  return null // Invisible logic component
}
