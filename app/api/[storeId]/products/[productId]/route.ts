import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";


export async function PATCH(
  req: Request,
  { params }: { params: { productId: string,storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const {
      name,
      price,
      categoryId,
      colorId,
      sizeId,
      images,
      isFeatured,
      isArchived,
    } = body;

    if(!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    
    if (!name) {
      return new NextResponse("name is required", { status: 400 });
    }
    if (!price) {
      return new NextResponse("price is required", { status: 400 });
    }
    if (!images) {
      return new NextResponse("images are required", { status: 400 });
    }
    if (!categoryId || !colorId || !sizeId || !params.storeId) {
      return new NextResponse(
        "store ,category, color and size ids are required",
        { status: 400 }
      );
    }
    if (!isFeatured) {
      return new NextResponse("Specify if product is featured ", {
        status: 400,
      });
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

    await prismadb.product.update({
      where: {
        id: params.productId,
  
      },
      data: {
        name,
      price,
      categoryId,
      colorId,
      sizeId,
      images:{
        deleteMany:{}
      },
      isFeatured,
      isArchived,
      }
    });
    const product = await  prismadb.product.update({
      where:{
        id:params.productId
      },
      data:{
        images:{
          createMany:{
            data:[
              ...images.map((item:{url:string})=>item)
            ]
          }
        }
      }
    })
  
    return NextResponse.json(product);

    
  } catch (error) {
    console.log('[product_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string,productId:string } }
) {
  try {
     const {userId} = auth()
     

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    if (!params.productId) {
      return new NextResponse("product id is required", { status: 400 });
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

    const product = await prismadb.product.deleteMany({
      where: {
        id: params.productId,
     
      }
    });
  
    return NextResponse.json(product);
  } catch (error) {
    console.log('[product_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function GET(
    _req: Request,
    { params }: { params: {productId:string } }
  ) {
    try {
      if (!params.productId) {
        return new NextResponse("productId id is required", { status: 400 });
      }
    
  
      const product = await prismadb.product.findUnique({
        where: {
          id: params.productId,
       
        },
        include:{
          images:true,
          category:true,
          size:true,
          color:true
        }
      });
    
      return NextResponse.json(product);
    } catch (error) {
      console.log('[product_DET]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };