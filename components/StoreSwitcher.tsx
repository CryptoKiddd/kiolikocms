"use client";

import { useStoreModal } from "@/hooks/use-store-modal";
import { cn } from "@/lib/utils";
import { Store } from "@prisma/client";
import {
  Check,
  ChevronsUpDown,
  PlusCircle,
  Store as StoreIcon,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface StoreSwitcherProps extends PopoverTriggerProps {
  items: Store[];
}

const StoreSwitcher = ({ className, items = [] }: StoreSwitcherProps) => {
  const [open, setOpen] = useState(false);

  const storemodal = useStoreModal();
  const params = useParams();
  const router = useRouter();

  const formattedItems = items.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });
  const currentStore = formattedItems.find(
    (item) => item.value === params.storeId
  );
  const onStoreSelect = (store: { value: string; label: string }) => {
    setOpen(false);
    router.push(`/${store.value}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a store"
          className={cn("2-[200px] justify-between", className)}
        >
          <StoreIcon className="mr-2 h-4 2-4" />
          {currentStore?.label}
          <ChevronsUpDown className="ml-auto h-4 2-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0  ">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search store" />
            <CommandEmpty className="h-4 text-sm p-2 pt-1 ">
              No Store found
            </CommandEmpty>
            <CommandGroup heading="stores">
              {formattedItems.map((store) => (
                <CommandItem
                  key={store.value}
                  onSelect={() => onStoreSelect(store)}
                  className="text-sm"
                 
                >
                  <StoreIcon className="w-4 h-4 mr-2" />
                  {store.label}
                  <Check
                    className={cn(
                      "ml-auto h-4  w-4",
                      currentStore?.value === store.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  storemodal.onOpen();
                }}
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Create Store
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default StoreSwitcher;
