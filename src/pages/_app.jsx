import { Layout as DefaultLayout } from '@/components/Layout'
import { Analytics } from '@vercel/analytics/react';

import 'focus-visible'
import '@/styles/tailwind.css'

export default function App({ Component, pageProps }) {
  let Layout = Component.Layout ?? DefaultLayout

  return (
    <Layout>
      <Component {...pageProps} />
      <Analytics />
    </Layout>
  )
}
