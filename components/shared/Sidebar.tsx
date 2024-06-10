
"use client"
import React from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { SignedIn, SignedOut } from '@clerk/nextjs'
import { PathnameContext } from 'next/dist/shared/lib/hooks-client-context.shared-runtime'
import { usePathname } from 'next/navigation'
import { link } from 'fs/promises'
import { UserButton } from '@clerk/nextjs'

import { navLinks } from '@/constants'

const Sidebar = () => {
    const pathName= usePathname();
  return (
   
        
        <aside className='sidebar'>
            <div className='flex size-full flex-col gap-4'>
               <Link href="/" className='sidebar-logo'>
               <Image src='/assets/images/logo-text.svg' alt='Logo' height={28} width={180} />
                            
               </Link>
               <nav className='sidebar-nav'>
                <SignedIn>
                            <ul className='sidebar-nav_elements'>
                    {navLinks.slice(0,6).map((link)=>{
                        const isActive=link.route === pathName;
                        return (
                            <li key={link.route} className={`sidebar-nav_element group ${
                            isActive?'bg-purple-gradient text-white': 'text-gray-700'}`}>
                               <Link href={link.route} className='sidebar-link'>
                               <Image
                               src={link.icon} 
                               alt='logo'
                               height={24}
                               width={24}
                               className={`${isActive&& 'brightness-200'}`}/>
                               {link.label}
                               </Link>
                            </li>
                        )
                    })}
                    </ul>
                    <ul className='sidebar-nav_elements'>
                    {navLinks.slice(6).map((link)=>{
                        const isActive=link.route === pathName;
                        return (
                            <li key={link.route} className={`sidebar-nav_element group ${
                            isActive?'bg-purple-gradient text-white': 'text-gray-700'}`}>
                               <Link href={link.route} className='sidebar-link'>
                               <Image
                               src={link.icon} 
                               alt='logo'
                               height={24}
                               width={24}
                               className={`${isActive&& 'brightness-200'}`}/>
                               {link.label}
                               </Link>
                            </li>
                        )
                    })}
                    <li className="flex-center gap-2 p-4 cursor-pointer">
                        <UserButton afterSignOutUrl='/' showName/>

                        
                    </li>
                            </ul>
                            </SignedIn>
                            <SignedOut>
                                <Button asChild className='bg-purple-gradient bg-cover'>
                                    <Link href='/sign-in'>Login
                                    </Link>
                                </Button>
                            </SignedOut>
               
               </nav>
            </div>
        </aside>
  )
}

export default Sidebar