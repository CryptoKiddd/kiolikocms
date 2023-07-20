"use client";


import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { ApiList } from "../ui/api-list";
import { Button } from "../ui/button";
import { DataTable } from "../ui/data-table";
import { Heading } from "../ui/Heading";
import { Separator } from "../ui/separator";
import { SizeColumn,columns } from "./SizeColumns";

interface SizesClientProps{
  data:SizeColumn[]
}

const SizesClient:React.FC<SizesClientProps> = ({
  data
}) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Sizes ${data.length}`}
          desc="Manage Sizes for your store"
        />

        <Button
          onClick={() => router.push(`/${params.storeId}/sizes/new`)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" desc="API calls for Sizes" />
      <Separator />
      <ApiList entityName="sizes" entityIdName="sizeId" />
    </>
  );
};

export default SizesClient;
