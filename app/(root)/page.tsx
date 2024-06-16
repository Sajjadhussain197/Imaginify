import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { navLinks } from "@/constants";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <section className="home">
        <h1 className="home-heading">
          Uleash your Creativity Vision With Imaginify 
        </h1>
      <ul className="flex-center gap-20 w-full">

          {
            navLinks.slice(0,5).map((link)=>(
              <Link 
              key={link.route}
              href={link.route}
              className="flex-center flex-col gap-2">
              <li>
                <Image src={link.icon} alt="image" 
                className="flex-center bg-white rounded-full p-4 w-fit"
                height={24} width={24} />
              </li>
                <p className="p-14-medium text-white text-center">{link.label}</p>
              
              </Link>
            ))
          }

      </ul>
        
      
      </section>
    </>
  );
}
