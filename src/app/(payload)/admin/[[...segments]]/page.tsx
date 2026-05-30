import type { Metadata } from 'next'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import config from '@payload-config'

type Args = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] }>
}

export async function generateMetadata({ params, searchParams }: Args): Promise<Metadata> {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  return generatePageMetadata({ config, params: resolvedParams, searchParams: resolvedSearchParams })
}

export default async function Page({ params, searchParams }: Args) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  return RootPage({ config, params: resolvedParams, searchParams: resolvedSearchParams })
}
