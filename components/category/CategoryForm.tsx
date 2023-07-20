"use client";
export const revalidate = 0;
import * as Z from "zod";

import { Billboard, Category } from "@prisma/client";
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

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface CategoryFormProps {
  initialData: Category | null;
  billboards:Billboard[]
}

type CategoryFormValues = Z.infer<typeof formSchema>;

const formSchema = Z.object({
  name: Z.string().min(1),
  billboardId: Z.string(),
});

const CategoryForm: React.FC<CategoryFormProps> = ({ initialData,billboards }) => {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const title = initialData ? "Edit Category" : "Create Category";
  const desc = initialData ? "Edit Category" : "Add new Category";
  const toastMessage = initialData ? "Category Edited" : "Category Created";
  const action = initialData ? "Edit" : "Create";

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      billboardId: "",
    },
  });

  const onSubmit = async (data: CategoryFormValues) => {
    console.log(initialData);
    try {
      if (initialData) {
        setLoading(true);
        await axios.patch(
          `/api/${params.storeId}/categories/${params.categoryId}`,
          data
        );
      } else {
        setLoading(true);
        await axios.post(`/api/${params.storeId}/categories`, data);
      }

      router.refresh();
      router.push(`/${params.storeId}/categories`);
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
        `/api/${params.storeId}/categories/${params.categoryId}`
      );
      router.push("/");
      toast.success("Category Deleted");
      router.refresh();
    } catch (error) {
      toast.error("Make sure you removed all products using this Category");
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
              name="name"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Category Name"
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
              name="billboardId"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Billboard</FormLabel>
                      <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                         <FormControl>
                          <SelectTrigger > 
                            <SelectValue defaultValue={field.value} placeholder='Select a Billboard' />

                          </SelectTrigger>
                         </FormControl>
                         <SelectContent>
                          {billboards.map(item=><SelectItem key={item.id} value={item.id}>{item.label}</SelectItem>)}
                         </SelectContent>
                      </Select>
                    <FormMessage />
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

export default CategoryForm;
