"use client";


import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { CategoryColumn, columns } from "../category/CategoryColumns";
import { ApiList } from "../ui/api-list";
import { Button } from "../ui/button";
import { DataTable } from "../ui/data-table";
import { Heading } from "../ui/Heading";
import { Separator } from "../ui/separator";

interface CategoryClientProps{
  data:CategoryColumn[]
}

const CategoryClient:React.FC<CategoryClientProps> = ({
  data
}) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Categories ${data.length}`}
          desc="Manage Categories for your store"
        />

        <Button
          onClick={() => router.push(`/${params.storeId}/categories/new`)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" desc="API calls for Categories" />
      <Separator />
      <ApiList entityName="Categories" entityIdName="CategoryId" />
    </>
  );
};

export default CategoryClient;
