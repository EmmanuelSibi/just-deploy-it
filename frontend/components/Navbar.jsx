
import { ComputerIcon, Ellipsis, RocketIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'



const Navbar = (props) => {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center bg-[#f0f0f0] dark:bg-[#2a2a2a]">
      <Link href="/" className="flex items-center justify-center">
        <RocketIcon className="h-6 w-6 text-[#3a3a3a] dark:text-[#f0f0f0] mr-2" />
        <span  >Just{"  "}<Ellipsis className="h-2 w-2 inline-block" />{"  "}Deploy {"  "}<Ellipsis  className="h-2 w-2 inline-block" />{"  "}It {"  "}</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Link href="/deploy">Deploy</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
      </nav>
    </header>
  )
}

export default Navbar