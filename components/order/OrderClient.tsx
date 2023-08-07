"use client";


import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { ApiList } from "../ui/api-list";
import { Button } from "../ui/button";
import { DataTable } from "../ui/data-table";
import { Heading } from "../ui/Heading";
import { Separator } from "../ui/separator";
import { OrderColumn,columns } from "./OrderColumns";

interface OrderClientProps{
  data:OrderColumn[]
}

const OrderClient:React.FC<OrderClientProps> = ({
  data
}) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
    
        <Heading
          title={`Order ${data.length}`}
          desc="Manage Orders for your store"
        />  
     
      <Separator />
      <DataTable searchKey="products" columns={columns} data={data} />

    </>
  );
};

export default OrderClient;
