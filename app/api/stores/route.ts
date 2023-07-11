import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function POST(
    req:Request
){
    try {
        const {userId} =auth()
        const body = await req.json()

        const {name} = body
        if(!name){
            return new NextResponse('Name is required',{status:400})
        }

        if(!userId){
            return new NextResponse("Unauthorized", {status:401})
        }

        const store = await prismadb.store.create({
            data:{
                name,
                userId
            }
        })

        return NextResponse.json(store)


        
    } catch (error) {

        console.log('[stores_post]', error)
        return new NextResponse('internal error',{status:500})
        
    }
}