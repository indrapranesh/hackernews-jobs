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
          content="Unlock a world of tech job opportunities with `Hacker News Jobs.` Explore curated listings from the dynamic Hacker News community and take your career to new heights!"
        />
      </Head>
      <Hero />
      <CallToAction />
      <SecondaryFeatures />
      <PrimaryFeatures />
    </>
  )
}
