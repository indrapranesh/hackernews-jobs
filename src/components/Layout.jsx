import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

export function Layout({ children }) {
  return (
    <>
      <Header />
        <main>{children}</main>
      <Footer />
    </>
  )
}
