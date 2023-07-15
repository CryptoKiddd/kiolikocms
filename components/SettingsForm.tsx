"use client";
export const revalidate = 0
import * as Z from "zod";

import { Store } from "@prisma/client";
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
import { ApiAlert } from "./ui/api-alert";

interface SettingsFormProps {
  initialData: Store;
}
const formSchema = Z.object({
  name: Z.string().min(1),
});

type SettingsFormValues = Z.infer<typeof formSchema>;

const SettingsForm: React.FC<SettingsFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: SettingsFormValues) => {
    console.log(data);
    try {
      setLoading(true);
      await axios.patch(`/api/stores/${params.storeId}`, data);
      router.refresh();
      toast.success("Store Updated");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  const onDelete = async () => {
   
    try {
      setLoading(true);
      await axios.delete(`/api/stores/${params.storeId}`, );
      router.push('/');
      toast.success("Store Deleted");
      router.refresh()
    } catch (error) {
      toast.error("Make sure you removed all products");
    } finally {
      setLoading(false);
      setOpen(false)
    }
  };

  

  return (
    <>
    <AlertModal
    isOpen={open}
    onClose={()=>setOpen(false)}
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
        <Heading title="Settings" desc="Manage Store preferences" />
        <Button
          disabled={loading}
          variant="destructive"
          size="icon"
          onClick={() => setOpen(true)}
        >
          <Trash className="h-4 w-4" />
        </Button>
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
              render={({ field }) => {return(
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder={field.value} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}}
            />
          </div>
          <Button disabled={loading} type="submit">
            Save Changes
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert title="desc" desc="test description" />
    </>
  );
};

export default SettingsForm;
