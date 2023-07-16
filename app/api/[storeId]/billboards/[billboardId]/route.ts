import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";


export async function PATCH(
  req: Request,
  { params }: { params: { billboardId: string,storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { label,imageUrl } = body;

    if(!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if(!label) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if(!imageUrl) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if(!params.billboardId) {
      return new NextResponse("billboard id is required", { status: 400 });
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

    const billboard = await prismadb.billboard.updateMany({
      where: {
        id: params.billboardId,
  
      },
      data: {
        label,
        imageUrl
      }
    });
  
    return NextResponse.json(billboard);

    
  } catch (error) {
    console.log('[Billboard_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string,billboardId:string } }
) {
  try {
     const {userId} = auth()
     

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    if (!params.billboardId) {
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

    const billboard = await prismadb.billboard.deleteMany({
      where: {
        id: params.billboardId,
     
      }
    });
  
    return NextResponse.json(billboard);
  } catch (error) {
    console.log('[billboard_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function GET(
    _req: Request,
    { params }: { params: {billboardId:string } }
  ) {
    try {
      if (!params.billboardId) {
        return new NextResponse("Store id is required", { status: 400 });
      }
    
  
      const billboard = await prismadb.billboard.findUnique({
        where: {
          id: params.billboardId,
       
        }
      });
    
      return NextResponse.json(billboard);
    } catch (error) {
      console.log('[billboard_DET]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };