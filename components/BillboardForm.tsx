"use client";
export const revalidate = 0;
import * as Z from "zod";

import { Billboard } from "@prisma/client";
import { Trash } from "lucide-react";
import { Button } from "./ui/button";
import { Heading } from "./ui/Heading";
import { Separator } from "./ui/separator";
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
} from "./ui/form";
import { Input } from "./ui/input";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "./modals/alert-modal";
import ImageUpload from "./ui/image-upload";

interface BillboardFormProps {
  initialData: Billboard | null;
}

type BillboardFormValues = Z.infer<typeof formSchema>;

const formSchema = Z.object({
  label: Z.string().min(1),
  imageUrl: Z.string(),
});

const BillboardForm: React.FC<BillboardFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const title = initialData ? "Edit Billboard" : "Create Billboard";
  const desc = initialData ? "Edit Billboard" : "Add new Billboard";
  const toastMessage = initialData ? "Billboard Edited" : "Billboard Created";
  const action = initialData ? "Edit" : "Create";

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: '',
      imageUrl: '',
    },
  });

  const onSubmit = async (data: BillboardFormValues) => {
    console.log(initialData);
    try {
      if(initialData){
        setLoading(true);
        await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data);
      }else{
        setLoading(true);
       await axios.post(`/api/${params.storeId}/billboards`, data);
        
      }
      
      router.refresh();
      router.push(`/${params.storeId}/billboards`)
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
      await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);
      router.push("/");
      toast.success("Billboard Deleted");
      router.refresh();
    } catch (error) {
      toast.error("Make sure you removed all categories using this billboard");
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
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Background image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value ? [field.value] : []}
                      disabled={loading}
                      onChange={(url) => field.onChange(url)}
                      onRemove={(url) => field.onChange("")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Label</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Billboard label"
                        {...field}
                      />
                    </FormControl>
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

export default BillboardForm;
