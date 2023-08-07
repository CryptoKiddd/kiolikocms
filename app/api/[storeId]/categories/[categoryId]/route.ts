import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  _req: Request,
  { params }: { params: {categoryId:string } }
) {
  try {
    if (!params.categoryId) {
      return new NextResponse("Store id is required", { status: 400 });
    }
  

    const category = await prismadb.category.findUnique({
      where: {
        id: params.categoryId,
     
      },
      include: {
        billboard:true,
      }
    });
  
    return NextResponse.json(category);
  } catch (error) {
    console.log('[cat_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};



export async function PATCH(
  req: Request,
  { params }: { params: { categoryId: string,storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, billboardId } = body;

    if(!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if(!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if(!params.categoryId) {
      return new NextResponse("categoryId is required", { status: 400 });
    }
    if(!billboardId) {
      return new NextResponse("billboardId is required", { status: 400 });
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

    const category = await prismadb.category.updateMany({
      where: {
        id: params.categoryId,
  
      },
      data: {
        name,
        billboardId
      }
    });
  
    return NextResponse.json(category);

    
  } catch (error) {
    console.log('[category_patch]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string,categoryId:string } }
) {
  try {
     const {userId} = auth()
     

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    if (!params.categoryId) {
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

    const category = await prismadb.category.deleteMany({
      where: {
        id: params.categoryId,
     
      }
    });
  
    return NextResponse.json(category);
  } catch (error) {
    console.log('[category_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

