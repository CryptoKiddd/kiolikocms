"use client";
export const revalidate = 0;
import * as Z from "zod";

import { Category, Color, Image, Product, Size } from "@prisma/client";
import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import { Heading } from "../ui/Heading";
import { Separator } from "../ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "../modals/alert-modal";

import ImageUpload from "../ui/image-upload";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Checkbox } from "../ui/checkbox";

interface ProductFormProps {
  initialData: Product & {
    images:Image[]
  } | null;
  categories:Category[],
  colors:Color[],
  sizes:Size[]
}

type ProductFormValues = Z.infer<typeof formSchema>;

const formSchema = Z.object({
  name: Z.string().min(1),
  images: Z.object({url:Z.string()}).array(),
  price:Z.coerce.number().min(1),
  categoryId:Z.string().min(1),
  sizeId:Z.string().min(1),
  colorId:Z.string().min(1),
  isArchived:Z.boolean().default(false).optional(),
  isFeatured:Z.boolean().default(false).optional()
});

const ProductForm: React.FC<ProductFormProps> = ({ initialData,categories,
  colors,
  sizes }) => {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const title = initialData ? "Edit Product" : "Create Product";
  const desc = initialData ? "Edit Product" : "Add new Product";
  const toastMessage = initialData ? "Product Edited" : "Product Created";
  const action = initialData ? "Edit" : "Create";

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData?{
      ...initialData,
      price:parseFloat(String(initialData?.price))
    } : {
      name: "",
      images:[],
      price:0,
      categoryId:'',
      colorId:'',
      sizeId:'',
      isFeatured:false,
      isArchived:false

    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    
    try {
      
      if (initialData) {
        setLoading(true);
        await axios.patch(
          `/api/${params.storeId}/products/${params.productId}`,
          data
        );
      } else {
        setLoading(true);
        await axios.post(`/api/${params.storeId}/products`, data);
      }

      router.refresh();
      router.push(`/${params.storeId}/products`);
      toast.success(toastMessage);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `/api/${params.storeId}/products/${params.productId}`
      );
      router.push(`/${params.storeId}/products`);
      toast.success("Product Deleted");
      router.refresh();
    } catch (error) {
      toast.error("Something Went wrong");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        loading={loading}
        onConfirm={onDelete}
      />
      <div
        className="
    flex
    items-center
    justify-between
    "
      >
        <Heading title={title} desc={desc} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Background image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value.map(image=>image.url)}
                      disabled={loading}
                      onChange={(url) => field.onChange([...field.value,{url}])}
                      onRemove={(url) => field.onChange([...field.value.filter(current=>current.url !== url)])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Product Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                      type="number"
                        disabled={loading}
                        placeholder="9.99"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
             <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                      <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                         <FormControl>
                          <SelectTrigger > 
                            <SelectValue defaultValue={field.value} placeholder='Select a Category' />

                          </SelectTrigger>
                         </FormControl>
                         <SelectContent>
                          {categories?.map(item=><SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}
                         </SelectContent>
                      </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
              <FormField
              control={form.control}
              name="sizeId"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Size</FormLabel>
                      <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                         <FormControl>
                          <SelectTrigger > 
                            <SelectValue defaultValue={field.value} placeholder='Select a Size' />

                          </SelectTrigger>
                         </FormControl>
                         <SelectContent>
                          {sizes?.map(item=><SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}
                         </SelectContent>
                      </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
                   <FormField
              control={form.control}
              name="colorId"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                      <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                         <FormControl>
                          <SelectTrigger > 
                            <SelectValue defaultValue={field.value} placeholder='Select a color' />

                          </SelectTrigger>
                         </FormControl>
                         <SelectContent>
                          {colors?.map(item=><SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}
                         </SelectContent>
                      </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
              <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => {
                return (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                      />

                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Featured
                      </FormLabel>
                      <FormDescription>
                        This product will appear on home page
                      </FormDescription>
                    </div>
                  </FormItem>
                );
              }}
            />
              <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => {
                return (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                      />

                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Archived
                      </FormLabel>
                      <FormDescription>
                        This product will not appear anywhere in the store
                      </FormDescription>
                    </div>
                  </FormItem>
                );
              }}
            />
         
          </div>
          <Button disabled={loading} type="submit">
            {action}
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  );
};

export default ProductForm;
