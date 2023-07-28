import Head from 'next/head'

import { CallToAction } from '@/components/CallToAction'
import { Hero } from '@/components/Hero'
import { PrimaryFeatures } from '@/components/PrimaryFeatures'
import { SecondaryFeatures } from '@/components/SecondaryFeatures'

export default function Home() {
  return (
    <>
      <Head>
        <title>Hacker Jobs</title>
        <meta
          name="description"
          content="Most bookkeeping software is accurate, but hard to use. We make the opposite trade-off, and hope you don’t get audited."
        />
      </Head>
      <Hero />
      <PrimaryFeatures />
      <SecondaryFeatures />
      <CallToAction />
    </>
  )
}
