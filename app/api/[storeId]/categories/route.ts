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

    const { name, billboardId } = body;

    if(!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if(!name) {
      return new NextResponse("label is required", { status: 400 });
    }
    if(!billboardId) {
      return new NextResponse("imageUrl is required", { status: 400 });
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


    

    const category = await prismadb.category.create({
      data: {
        name,
        billboardId,
        storeId:params.storeId
      }
    });
  
    return NextResponse.json(category);

    
  } catch (error) {
    console.log('[billboard_post]', error);
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
   
  
  
      
  
      const categories = await prismadb.category.findMany({
       where:{
        storeId:params.storeId
       }
      });
    
      return NextResponse.json(categories);
  
      
    } catch (error) {
      console.log('[categries]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };
  