
import { auth,UserButton } from "@clerk/nextjs";

import { StoreSwitcher, MainNav } from "@/components/index.js";

import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";
import { Store } from "@prisma/client";
import { ThemeToggle } from "./theme-toggle";
interface NavbarProps{
    stores:Store[]
}
const Navbar:React.FC<NavbarProps> = ({
    stores
}) => {
    const {userId}=auth()
    if(!userId){
        redirect('/sign-in')
    }
 
    return ( 
        <div className="border-b">
           <div className="flex h-16 items-center px-4">
            <StoreSwitcher items={stores} />
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
                <ThemeToggle />
                <UserButton afterSignOutUrl="/" />

            </div>


           </div>
        </div>
    );
}
 
export default Navbar;