import Stripe from "stripe"
import {headers} from "next/headers"

import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import prismadb from "@/lib/prismadb"


export async function POST(req:Request){
    const body = await req.text()
    const signature = headers().get("Stripe-Signature") as string

    let event:Stripe.Event

    try{
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    }catch(error:any){
        return new NextResponse(`WebHook error:${error.message}`,{status:400})

    }
    const session = event.data.object as Stripe.Checkout.Session;
    const adress = session?.customer_details?.address;

    const adressCompos = [
        adress?.line1,
        adress?.line2,
        adress?.country,
        adress?.city,
        adress?.postal_code,
        adress?.state
    ]
    const adressString = adressCompos.filter((c)=>c !== null).join(", ")

    if(event.type === "checkout.session.completed"){
        const order = await prismadb.order.update({
            where:{
                id:session?.metadata?.orderId
            },
            data:{
                isPaid:true,
                address:adressString,
                phone:session?.customer_details?.phone || "",

            },
            include:{
                orderItems:true
            }
        })
        const productsIds = order.orderItems.map((item)=>item.productId)
        await prismadb.product.updateMany({
            where:{
                id:{
                    in:[...productsIds]

                }
            },
            data:{
                isArchived:true
            }
        })
        return new NextResponse(null,{status:200})
    }




}