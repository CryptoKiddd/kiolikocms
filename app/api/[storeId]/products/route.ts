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
    

    if (!userId) {
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
      where: {
        userId,
        id: params.storeId,
      },
    });
    if (!storeByUserId) {
      return new NextResponse("Not authorized", { status: 403 });
    }

    const product = await prismadb.product.create({
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        isFeatured,
        isArchived,
        storeId: params.storeId,
        images:{
          createMany:{
            data:[
              ...images.map((image:{url:string})=>image)
            ]
          }
        }
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[product_post]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
   try {
     const {searchParams}= new URL(req.url)
     const categoryId = searchParams.get("categoryId") || undefined
     const colorId = searchParams.get("colorId") || undefined
     const sizeId = searchParams.get("sizeId") || undefined
     const isFeatured = searchParams.get("isFeatured") 
   

    if (!params.storeId) {
      return new NextResponse("store id is required", { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured:isFeatured?true:undefined,
        isArchived:false
      },
      include:{
        images:true,
        category:true,
        color:true,
        size:true

      },
      orderBy:{
        createdAt:'desc'
      }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log("[products_get]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
