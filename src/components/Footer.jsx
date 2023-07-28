import Link from 'next/link'

import { Container } from '@/components/Container'
import { Logo } from '@/components/Logo'
import { NavLink } from '@/components/NavLink'

export function Footer() {
  return (
    <footer className="bg-slate-50">
      <Container>
        <div className="py-8">
          <Logo className="mx-auto h-10 w-auto" />
        </div>
        <div className="flex justify-center border-t border-slate-400/10 py-10 ">

          <p className="mt-6 text-sm text-slate-500 sm:mt-0">
            Copyright &copy; {new Date().getFullYear()} Hacker jobs.
          </p>
        </div>
      </Container>
    </footer>
  )
}
