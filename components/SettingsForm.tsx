"use client";

import * as Z from "zod";

import { Store } from "@prisma/client";
import { Trash } from "lucide-react";
import { Button } from "./ui/button";
import { Heading } from "./ui/Heading";
import { Separator } from "./ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";

interface SettingsFormProps {
  initialData: Store;
}
const formSchema = Z.object({
  name: Z.string().min(1),
});

type SettingsFormValues = Z.infer<typeof formSchema>;

const SettingsForm: React.FC<SettingsFormProps> = ({ initialData }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });
  const onSubmit =async(values:SettingsFormValues)=>{
    //do simet
  }

  return (
    <>
      <div
        className="
    flex
    items-center
    justify-between
    "
      >
        <Heading title="Settings" desc="Manage Store preferences" />
        <Button disabled={loading} variant="destructive" size="icon" onClick={() =>setOpen(true)}>
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
            <div className="grid grid-cols-3 gap-8">
                <FormField control={form.control} name='name' render={({field})=>(
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input disabled={loading} placeholder={field.value} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>
            <Button disabled={loading} type='submit'>
                Save Changed
            </Button>

        </form>

      </Form>
    </>
  );
};

export default SettingsForm;
