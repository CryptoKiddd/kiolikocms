import Navbar from "@/components/Navbar"
import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
    children,
    params
}:{
    children:React.ReactNode,
    params:{
        storeId:string
    }
}){
    const {userId } = auth()
    if(!userId){
        redirect('/sing-in')
    }
    const store = await prismadb.store.findFirst({
        where:{
            id:params.storeId,
            userId
        }
    })

    if(!store){
        redirect('/')
    }

    return(
        <>
        <div>
             {/* @ts-expect-error Server Component */}
            <Navbar />
            {children}
        </div>
        </>
    )
}