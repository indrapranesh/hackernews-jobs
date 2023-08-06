import { useEffect, useState } from 'react'
import Image from 'next/image'

import { Container } from '@/components/Container'
import backgroundImage from '@/images/background-features.jpg'
import { Button } from './Button'

export function PrimaryFeatures() {
  let [tabOrientation, setTabOrientation] = useState('horizontal')

  useEffect(() => {
    let lgMediaQuery = window.matchMedia('(min-width: 1024px)')

    function onMediaQueryChange({ matches }) {
      setTabOrientation(matches ? 'vertical' : 'horizontal')
    }

    onMediaQueryChange(lgMediaQuery)
    lgMediaQuery.addEventListener('change', onMediaQueryChange)

    return () => {
      lgMediaQuery.removeEventListener('change', onMediaQueryChange)
    }
  }, [])

  return (
    <section
      id="features"
      aria-label="Features for running your books"
      className="relative overflow-hidden bg-blue-600 pb-28 pt-20 sm:py-32"
    >
      <Image
        className="absolute left-1/2 top-1/2 max-w-none translate-x-[-44%] translate-y-[-42%]"
        src={backgroundImage}
        alt=""
        width={2245}
        height={1636}
        unoptimized
      />
      <Container className="relative">
        <div className="max-w-2xl md:mx-auto md:text-center xl:max-w-none">
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl md:text-5xl">
            Discover personalized job opportunities with our tailored newsletter
            service - Hacker News Express
          </h2>
          <div className='mt-10'>
            <Button href="/express" className="bg-white hover:bg-white">
              <span className='text-black'>Subscribe to HackerX </span>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
