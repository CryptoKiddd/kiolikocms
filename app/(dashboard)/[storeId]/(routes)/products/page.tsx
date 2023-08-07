import BillboardClient from "@/components/billboard/BillboardClient";
import { BillboardColumn } from "@/components/billboard/BillboardColumns";
import ProductClient from "@/components/product/ProductClient";
import { ProductColumn } from "@/components/product/ProductColumns";
import prismadb from "@/lib/prismadb"
import { formatter } from "@/lib/utils";
import {format} from "date-fns"

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
  const products = await prismadb.product.findMany({
    where:{
        storeId:params.storeId
    },
    orderBy:{
        createdAt:'desc'
    },
    include:{
      category:true,
      size:true,
      color:true
    }
  });

 const formattedProducts:ProductColumn[]= products.map(item=>({
    id:item.id,
    name:item.name,
    price:Number(item.price),
    isFeatured:item.isFeatured,
    isArchived: item.isArchived,
    category:item.category.name,
    size:item.size.name,
    color:item.color.value,
    createdAt:format(item.createdAt,"MMM do, yyy")
 }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6 ">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
