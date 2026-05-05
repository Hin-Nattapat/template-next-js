"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";

import AppButton from "@/components/common/buttons/app-button";
import FormInput from "@/components/form-controls/form-input";
import FormInputArea from "@/components/form-controls/form-input-area";
import FormSelect from "@/components/form-controls/form-select";
import { Form } from "@/components/ui/form";
import { useDialog } from "@/hooks/use-dialog";

const options = [
  { value: "1", label: "Option 1" },
  { value: "2", label: "Option 2" },
  { value: "3", label: "Option 3" },
];

const ExamplePage = () => {
  const form = useForm();
  const dialog = useDialog();

  const handleToast = () => {
    toast.success("Saved successfully");
  };

  const handleConfirm = async () => {
    const ok = await dialog.confirm({
      title: "Confirm action",
      description: "Are you sure you want to continue?",
    });
    if (ok) toast.success("Confirmed");
  };

  return (
    <div className="container mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-2 text-2xl font-semibold">Example Feature</h1>
      <p className="text-muted-foreground mb-8 text-sm">
        Showcase of buttons, form controls, toast, and dialog patterns.
      </p>

      <Form {...form}>
        <div className="mb-8 flex flex-wrap gap-2">
          <AppButton variant="default" text="Toast" onClick={handleToast} />
          <AppButton variant="secondary" text="Confirm dialog" onClick={handleConfirm} />
          <AppButton variant="outline" text="Outline" />
          <AppButton variant="ghost" text="Ghost" />
          <AppButton variant="link" text="Link" />
          <AppButton variant="destructive" text="Destructive" />
        </div>

        <div className="flex flex-col gap-4">
          <FormInput required name="name" label="Name" placeholder="Enter name" />
          <FormSelect required name="category" label="Category" options={options} />
          <FormInputArea
            required
            name="description"
            label="Description"
            placeholder="Enter description"
          />
        </div>
      </Form>
    </div>
  );
};

export default ExamplePage;
