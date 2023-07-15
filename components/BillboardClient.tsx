'use client'

import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "./ui/button"
import { Heading } from "./ui/Heading"
import { Separator } from "./ui/separator"

const BillboardClient = () => {
    const router = useRouter()
    const params = useParams()
  return (
    <>
    <div className="flex items-center justify-between">
        <Heading title="Billboards (0)" desc="Manage Billboards for your store" />

        <Button onClick={()=>router.push(`/${params.storeId}/billboards/new`)}>
            <Plus className="w-4 h-4 mr-2" />
            Add new
        </Button>
   

    </div>
    <Separator />
    </>
  )
}

export default BillboardClient