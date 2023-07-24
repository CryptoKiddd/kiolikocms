import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";


export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name,value } = body;

    if(!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if(!name) {
      return new NextResponse("name is required", { status: 400 });
    }
    if(!value) {
      return new NextResponse("value is required", { status: 400 });
    }
    if(!params.storeId) {
      return new NextResponse("store id is required", { status: 400 });
    }
    const storeByUserId = await prismadb.store.findFirst({
        where:{
            userId,
            id:params.storeId
        }
    })
    if(!storeByUserId) {
        return new NextResponse("Not authorized", { status: 403 });
      }


    

    const color = await prismadb.color.create({
      data: {
        name,
        value,
        storeId:params.storeId
      }
    });
  
    return NextResponse.json(color);

    
  } catch (error) {
    console.log('[colros_post]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }
  ) {
    try {
   
      if(!params.storeId) {
        return new NextResponse("store id is required", { status: 400 });
      }
   
  
  
      
  
      const colors = await prismadb.color.findMany({
       where:{
        storeId:params.storeId
       }
      });
    
      return NextResponse.json(colors);
  
      
    } catch (error) {
      console.log('[colors_get]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };
  