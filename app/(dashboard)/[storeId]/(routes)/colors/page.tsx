import BillboardClient from "@/components/billboard/BillboardClient";
import ColorClient from "@/components/color/ColorClient";
import SizesClient from "@/components/size/SizeClient";

import { SizeColumn } from "@/components/size/SizeColumns";
import prismadb from "@/lib/prismadb"
import {format} from "date-fns"

const ColorsPage = async ({ params }: { params: { storeId: string } }) => {
  const colors = await prismadb.color.findMany({
    where:{
        storeId:params.storeId
    },
    orderBy:{
        createdAt:'desc'
    }
  });

 const formattedColors:SizeColumn[]= colors.map(item=>({
    id:item.id,
    name:item.name,
    value:item.value,
    createdAt:format(item.createdAt,"MMM do, yyy")
 }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6 ">
        <ColorClient data={formattedColors} />
      </div>
    </div>
  );
};

export default ColorsPage;
