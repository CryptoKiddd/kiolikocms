"use client";


import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { ApiList } from "../ui/api-list";
import { Button } from "../ui/button";
import { DataTable } from "../ui/data-table";
import { Heading } from "../ui/Heading";
import { Separator } from "../ui/separator";
import { ColorColumn,columns } from "./ColorColumns";

interface ColorsClientProps{
  data:ColorColumn[]
}

const ColorClient:React.FC<ColorsClientProps> = ({
  data
}) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Colors ${data.length}`}
          desc="Manage Colors for your store"
        />

        <Button
          onClick={() => router.push(`/${params.storeId}/colors/new`)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" desc="API calls for Colors" />
      <Separator />
      <ApiList entityName="colors" entityIdName="colorId" />
    </>
  );
};

export default ColorClient;
