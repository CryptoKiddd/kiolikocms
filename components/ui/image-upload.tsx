"use client"

import { ImagePlus, Trash } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "./button"
import Image from 'next/image'
import { CldUploadWidget } from "next-cloudinary"

interface ImageUploadProps {
    disabled?:boolean,
    onChange:(value:string)=>void,
    onRemove:(value:string)=>void,
    value:string[]
}

const ImageUpload:React.FC<ImageUploadProps> = ({
    disabled,
    onChange,
    onRemove,
    value
}) => {
    const [isMounted, setIsMounted] = useState(false)
    const onUpload = (result:any)=>{
      onChange(result.info.secure_url)
    }

    useEffect(()=>{
        setIsMounted(true)
    },[])
    if(!isMounted){
        return null
    }

    return ( 
        <div>
           <div className="mb-4 flex items-center gap-4">
            {
                value.map(url=>{
                    return(
                        <div className="relative w-[200px] h-[200px] rounded-md overflow-hidden " key={url}>
                            <div className="z-10 absolute top-2 right-2">
                                <Button type="button" onClick={()=>onRemove(url)} variant='destructive' size='icon'>
                                    <Trash className="w-4 h-4" />
                                </Button>
                            </div>
                            <Image
                            fill
                            className="object-cover"
                            alt="Billboard Image"
                            src={url}

                            />
  
                        </div>
                    )
                })
            }
           </div>
           <CldUploadWidget onUpload={onUpload} uploadPreset='rtyfqobr' >
            {({open})=>{
                const onClick =()=>{
                    open()
                }
                return(
                    <Button type="button" disabled={disabled} variant='secondary' onClick={onClick}>
                        <ImagePlus className="h-4 2-4 mr-2" />
                        Upload Image
                    </Button>
                )
            }}

           </CldUploadWidget>
        </div>
    );
}
 
export default ImageUpload;