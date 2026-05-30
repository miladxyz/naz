import type { ServerFunctionClient } from 'payload'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import config from '@payload-config'
import React from 'react'

import '@payloadcms/next/css'

type Args = { children: React.ReactNode }

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
  })
}

// Payload's RootLayout renders its own <html> and <body>.
// Our root layout.tsx is a bare passthrough so there is no conflict.
export default function Layout({ children }: Args) {
  return (
    <RootLayout config={config} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  )
}
