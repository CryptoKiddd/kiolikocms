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
    const stores = await prismadb.store.findMany({
        where:{
            userId
        }
    })
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
            {/* {@@ts-exept} */}
            <Navbar stores={stores} />
            {children}
        </div>
        </>
    )
}