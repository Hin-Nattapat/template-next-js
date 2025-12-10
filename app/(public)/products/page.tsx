"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";

import AppButton from "@/components/common/app-button";
import FormInput from "@/components/form/form-input";
import FormInputArea from "@/components/form/form-input-area";
import FormSelect from "@/components/form/form-select";
import { Form } from "@/components/ui/form";

const options = [
  { value: "1", label: "Option 1" },
  { value: "2", label: "Option 2" },
  { value: "3", label: "Option 3" },
];
export default function Home() {
  const form = useForm();

  const handleToast = () => {
    toast.success("Product added successfully");
    // toast.error("Product added failed");
    // toast.info("Product added info");
    // toast.warning("Product added warning");
    // toast.loading("Product added loading");
  };

  return (
    <div className="bg-brew-background flex min-h-screen items-center justify-center font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center gap-2 bg-white px-16 py-32 sm:items-start dark:bg-black">
        <Form {...form}>
          <AppButton variant={"default"} text="Add Product" onClick={handleToast} />
          <AppButton variant={"secondary"} text="Add Product" />
          <AppButton variant={"outline"} text="Add Product" />
          <AppButton variant={"ghost"} text="Add Product" />
          <AppButton variant={"link"} text="Add Product" />
          <AppButton variant={"destructive"} text="Add Product" />
          <FormSelect required name="category" label="Category" options={options} />
          <FormInputArea
            required
            name="description"
            label="Description"
            placeholder="Enter description"
          />
          <FormInput required name="name" label="Name" placeholder="Enter name" />
        </Form>
      </main>
    </div>
  );
}
