"use client";
export const revalidate = 0;
import * as Z from "zod";

import { Color } from "@prisma/client";
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


interface ColorFormProps {
  initialData: Color | null;

}
const formSchema = Z.object({
  name: Z.string().min(1),
  value: Z.string().min(4).regex(/^#/,{
    message:"Value must be a valid hex code"
  })
});
type ColorFormValues = Z.infer<typeof formSchema>;



const ColorForm: React.FC<ColorFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const title = initialData ? "Edit Color" : "Create Color";
  const desc = initialData ? "Edit Color" : "Add new Color";
  const toastMessage = initialData ? "Color Edited" : "Color Created";
  const action = initialData ? "Edit" : "Create";

  const form = useForm<ColorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      value: "",
    },
  });

  const onSubmit = async (data: ColorFormValues) => {
    console.log(initialData);
    try {
      if (initialData) {
        setLoading(true);
        await axios.patch(
          `/api/${params.storeId}/colors/${params.colorId}`,
          data
        );
      } else {
        setLoading(true);
        await axios.post(`/api/${params.storeId}/colors`, data);
      }

      router.refresh();
      router.push(`/${params.storeId}/colors`);
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
        `/api/${params.storeId}/colors/${params.colorId}`
      );
      router.push("/");
      toast.success("Color Deleted");
      router.refresh();
    } catch (error) {
      toast.error("Make sure you removed all products using this Color");
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
      onConfirm={onDelete}
      loading={loading}
    />
     <div className="flex items-center justify-between">
        <Heading title={title} desc={desc} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Color name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-4">
                    <Input disabled={loading} placeholder="Color value" {...field} />
                    <div className="
                    border 
                    p-4 rounded-full
                    " style={{backgroundColor:field.value}}></div>

                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default ColorForm;
