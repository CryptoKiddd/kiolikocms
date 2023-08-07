"use client"

import axios from "axios"
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { AlertModal } from "../modals/alert-modal"
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { ProductColumn } from "./ProductColumns"

interface CellActionProps{
    data:ProductColumn
}


export const CellAction:React.FC<CellActionProps> =({
    data
})=>{
    const router = useRouter()
    const params = useParams()
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    const onCopy = (id:string)=>{
        navigator.clipboard.writeText(id);
        toast.success('Copied To Clipboard')
      }
      const onDelete = async () => {
        try {
          setLoading(true);
          await axios.delete(`/api/${params.storeId}/products/${data.id}`);
          toast.success("Product Deleted");
          router.refresh();
        } catch (error) {
          toast.error("Something went wrong");
        } finally {
          setLoading(false);
          setOpen(false);
        }
      };
    return(
        <>
       <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
                <span className="sr-only">Open Menu</span>
                <MoreHorizontal className="h-4  w-4" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
         <DropdownMenuLabel>
            Actions
         </DropdownMenuLabel>
         <DropdownMenuItem onClick={()=>onCopy(data.id)}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Id
         </DropdownMenuItem>
         <DropdownMenuItem onClick={()=>router.push(`/${params.storeId}/products/${data.id}`)}>
            <Edit className="mr-2 h-4 w-4" />
            update
         </DropdownMenuItem>
         <DropdownMenuItem onClick={()=>setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
         </DropdownMenuItem>
        </DropdownMenuContent>
       </DropdownMenu>
       <AlertModal isOpen={open} onClose={()=>setOpen(false)} onConfirm={onDelete} loading={loading} />
        </>
    )
}