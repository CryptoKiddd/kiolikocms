import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";


export async function PATCH(
  req: Request,
  { params }: { params: { sizeId: string, storeId: string } }
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

    if(!params.sizeId) {
      return new NextResponse("sizeId id is required", { status: 400 });
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

    const size = await prismadb.size.updateMany({
      where: {
        id: params.sizeId,
  
      },
      data: {
        name,
        value
      }
    });
  
    return NextResponse.json(size);

    
  } catch (error) {
    console.log('[size_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string,sizeId:string } }
) {
  try {
     const {userId} = auth()
     

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    if (!params.sizeId) {
      return new NextResponse("Store id is required", { status: 400 });
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

    const size = await prismadb.size.deleteMany({
      where: {
        id: params.sizeId,
     
      }
    });
  
    return NextResponse.json(size);
  } catch (error) {
    console.log('[size_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function GET(
    _req: Request,
    { params }: { params: {sizeId:string } }
  ) {
    try {
      if (!params.sizeId) {
        return new NextResponse("Store id is required", { status: 400 });
      }
    
  
    const size = await prismadb.size.findUnique({
      where:{
        id:params.sizeId
      }
    })
    
      return NextResponse.json(size);
    } catch (error) {
      console.log('[size_DELETE]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };