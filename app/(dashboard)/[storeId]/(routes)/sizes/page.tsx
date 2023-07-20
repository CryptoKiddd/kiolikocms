import BillboardClient from "@/components/billboard/BillboardClient";
import SizesClient from "@/components/size/SizeClient";

import { SizeColumn } from "@/components/size/SizeColumns";
import prismadb from "@/lib/prismadb"
import {format} from "date-fns"

const SizesPage = async ({ params }: { params: { storeId: string } }) => {
  const sizes = await prismadb.size.findMany({
    where:{
        storeId:params.storeId
    },
    orderBy:{
        createdAt:'desc'
    }
  });

 const formattedSizes:SizeColumn[]= sizes.map(item=>({
    id:item.id,
    name:item.name,
    value:item.values,
    createdAt:format(item.createdAt,"MMM do, yyy")
 }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6 ">
        <SizesClient data={formattedSizes} />
      </div>
    </div>
  );
};

export default SizesPage;
