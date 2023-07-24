import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";


export async function PATCH(
  req: Request,
  { params }: { params: { colorId: string, storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { value,name } = body;

    if(!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if(!name) {
      return new NextResponse("name is required", { status: 400 });
    }
    if(!value) {
      return new NextResponse("value is required", { status: 400 });
    }

    if(!params.colorId) {
      return new NextResponse("Color id is required", { status: 400 });
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

    const color = await prismadb.color.updateMany({
      where: {
        id: params.colorId,
  
      },
      data: {
        name,
        value
      }
    });
  
    return NextResponse.json(color);

    
  } catch (error) {
    console.log('[color_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string,colorId:string } }
) {
  try {
     const {userId} = auth()
     

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    if (!params.colorId) {
      return new NextResponse("Color id is required", { status: 400 });
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

    const color = await prismadb.color.deleteMany({
      where: {
        id: params.colorId,
     
      }
    });
  
    return NextResponse.json(color);
  } catch (error) {
    console.log('[color_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function GET(
    _req: Request,
    { params }: { params: {colorId:string } }
  ) {
    try {
      if (!params.colorId) {
        return new NextResponse("Store id is required", { status: 400 });
      }
    
  
    const color = await prismadb.color.findUnique({
      where:{
        id:params.colorId
      }
    })
    
      return NextResponse.json(color);
    } catch (error) {
      console.log('[color_DELETE]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };