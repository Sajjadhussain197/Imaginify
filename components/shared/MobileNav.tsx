"use client"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
  import Link from "next/link"
  import Image from "next/image"
import { UserButton } from "@clerk/nextjs"
import { SignedIn, SignedOut } from '@clerk/nextjs'
import { navLinks } from "@/constants"
import { usePathname } from "next/navigation"
import { Button } from "../ui/button"
const MobileNav = () => {
    const pathName = usePathname();
  return (
    <header className="header">
        <Link href="/" className="flex items-center md:py-2 gap-2">
        <Image src="/assets/images/logo-text.svg" alt="logo"
        width={180} height={28}/>
        </Link>
        <nav className="flex gap-2">
           <SignedIn> 
                <UserButton afterSignOutUrl="/" />
                <Sheet>
                        <SheetTrigger>
                            <Image src="assets/icons/menu.svg"
                            alt="menu"
                            height={32}
                            width={32}
                            className="cursor-pointer"/>
                        </SheetTrigger>
                        <SheetContent className="sheet-content sm:w-64">
                           <Image 
                           src="/assets/images/logo-text.svg" alt="logo" 
                           height={23}
                           width={152}/>
                            <ul className='header-nav_elements'>
                    {navLinks.map((link)=>{
                        const isActive=link.route === pathName;
                        return (
                            <li key={link.route} className={`${
                            isActive&&'gradient-text'} p-1 flex 
                            whitespace-nowrap text-dark-700 `}>
                               <Link href={link.route} className="sidebar-link cursor-pointer" >
                               <Image 
                               src={link.icon}
                               alt="logo"
                               width={24}
                               height={24}/>
                               {link.label}
                               </Link>
                            </li>
                        )
                    })}
                    
                    <li className="flex-center gap-2 p-4 cursor-pointer">
                        <UserButton afterSignOutUrl='/' showName/>

                        
                    </li>
                            </ul>
                        </SheetContent>
                        </Sheet>

           </SignedIn> 
           <SignedOut>
                                <Button asChild className='bg-purple-gradient bg-cover'>
                                    <Link href='/sign-in'>Login
                                    </Link>
                                </Button>
            </SignedOut>
        </nav>
    </header>
  )
}

export default MobileNav