"use client"

import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react"
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { BillboardColumn } from "./BillboardColumns"

interface CellActionProps{
    data:BillboardColumn
}


export const CellAction:React.FC<CellActionProps> =({
    data
})=>{
    return(
       <DropdownMenu>
        <DropdownMenuTrigger>
            <Button variant='ghost' className='h-8 w-8 p-8'>
                <span className="sr-only">Open Menu</span>
                <MoreHorizontal className="h-4  w-4" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
         <DropdownMenuLabel>
            Actions
         </DropdownMenuLabel>
         <DropdownMenuItem>
            <Copy className="mr-2 h-4 w-4" />
            Copy Id
         </DropdownMenuItem>
         <DropdownMenuItem>
            <Edit className="mr-2 h-4 w-4" />
            update
         </DropdownMenuItem>
         <DropdownMenuItem>
            <Trash className="mr-2 h-4 w-4" />
            Delete
         </DropdownMenuItem>
        </DropdownMenuContent>
       </DropdownMenu>
    )
}