"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";

import AppButton from "@/components/common/buttons/app-button";
import FormInput from "@/components/form-controls/form-input";
import FormInputArea from "@/components/form-controls/form-input-area";
import FormSelect from "@/components/form-controls/form-select";
import { Form } from "@/components/ui/form";
import { useDialog } from "@/hooks/use-dialog";
import { exampleMessages } from "@/i18n/messages/example";
import { useMessages } from "@/i18n/use-i18n";

const OPTION_VALUES = ["1", "2", "3"];

const ExamplePage = () => {
  const form = useForm();
  const dialog = useDialog();
  const m = useMessages(exampleMessages);

  const options = OPTION_VALUES.map(value => ({
    value,
    label: m.option(Number(value)),
  }));

  const handleToast = () => {
    toast.success(m.saved);
  };

  const handleConfirm = async () => {
    const ok = await dialog.confirm({
      title: m.confirmTitle,
      description: m.confirmDescription,
    });
    if (ok) {
      toast.success(m.confirmed);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-2 text-2xl font-semibold">{m.title}</h1>
      <p className="text-muted-foreground mb-8 text-sm">{m.description}</p>

      <Form {...form}>
        <div className="mb-8 flex flex-wrap gap-2">
          <AppButton variant="default" label={m.toast} onClick={handleToast} />
          <AppButton
            variant="secondary"
            label={m.confirmDialog}
            onClick={handleConfirm}
          />
          <AppButton variant="outline" label={m.outline} />
          <AppButton variant="ghost" label={m.ghost} />
          <AppButton variant="link" label={m.link} />
          <AppButton variant="destructive" label={m.destructive} />
        </div>

        <div className="flex flex-col gap-4">
          <FormInput
            required
            name="name"
            label={m.nameLabel}
            placeholder={m.namePlaceholder}
          />
          <FormSelect
            required
            name="category"
            label={m.categoryLabel}
            options={options}
          />
          <FormInputArea
            required
            name="description"
            label={m.descriptionLabel}
            placeholder={m.descriptionPlaceholder}
          />
        </div>
      </Form>
    </div>
  );
};

export default ExamplePage;
