import Image from 'next/image'

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import backgroundImage from '@/images/background-call-to-action.jpg'

export function CallToAction() {
  return (
    <section
      id="get-started-today"
      className="relative overflow-hidden bg-blue-600 py-32"
    >
      <Image
        className="absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
        src={backgroundImage}
        alt=""
        width={2347}
        height={1244}
        unoptimized
      />
      <Container className="relative">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
            Introducing HackerX
          </h2>
          <p className="mt-4 text-lg tracking-tight text-white">
          Discover your dream tech job with our personalized handpicked job newsletter! Get a curated selection of top tech opportunities delivered to your inbox, making job hunting smarter and more efficient.
          </p>
          <div className='mt-10'>
            <Button href="/express" className="bg-white hover:bg-white">
              <span className='text-black'>Join HackerX </span>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
