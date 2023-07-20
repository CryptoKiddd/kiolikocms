"use client"

import { useOrigin } from "@/hooks/use-origin";
import { useParams, useRouter } from "next/navigation";
import { ApiAlert } from "./api-alert";

interface ApiListProps{
    entityName:string,
    entityIdName:string
}

export const ApiList:React.FC<ApiListProps> = ({
    entityName,
    entityIdName,
}) => {
    const params = useParams()
    const origin = useOrigin()

    const baseUrl = `${origin}/api/${params.storeId}`

    return ( 
        <>
        <ApiAlert title="GET"
         variant="public"
         desc={`${baseUrl}/${entityName}`}
         />
        <ApiAlert title="GET"
         variant="public"
         desc={`${baseUrl}/${entityName}/{${entityIdName}}`}
         />
        <ApiAlert title="POST"
         variant="admin"
         desc={`${baseUrl}/${entityName}/`}
         />
          <ApiAlert title="PATCH"
         variant="admin"
         desc={`${baseUrl}/${entityName}/{${entityIdName}}`}
         />
          <ApiAlert title="DELETE"
         variant="admin"
         desc={`${baseUrl}/${entityName}/{${entityIdName}}`}
         />
        </>
     );
}
 