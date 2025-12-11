"use client";

import { CheckCircle2, ShoppingCart, XCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useDialog } from "@/hooks/use-dialog";

import CodeBlock from "../code-block";
import Section from "../section";

const FeedbackSection = () => {
  const { success, error, confirm } = useDialog();

  const handleSuccessToast = () => {
    toast.success("Item successfully added to your cart.");
  };

  const handleErrorToast = () => {
    toast.error("Could not update your profile.");
  };

  const handleInfoToast = () => {
    toast.info("New coffee beans are now available!");
  };

  const handleWarningToast = () => {
    toast.warning("Your session will expire in 5 minutes.");
  };

  const handleSuccessDialog = () => {
    success({
      title: "Success",
      message: "Your order has been placed successfully!",
    });
  };

  const handleErrorDialog = () => {
    error({
      title: "Error",
      message: "Failed to process your request. Please try again.",
    });
  };

  const handleConfirmDialog = async () => {
    const confirmed = await confirm({
      title: "Delete Item",
      description: "Are you sure you want to remove this item from your cart?",
      confirmText: "Remove",
      variant: "destructive",
    });

    if (confirmed) {
      toast.success("Item removed from cart");
    }
  };

  return (
    <Section
      id="feedback"
      title="6. Feedback"
      description="Feedback components are subtle and non-intrusive, designed to inform the user without disrupting their flow."
    >
      <div className="space-y-8">
        <div>
          <h3 className="text-muted-foreground mb-4 text-sm font-medium">
            Toast / Snackbar
          </h3>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={handleSuccessToast}>
                Success Toast
              </Button>
              <Button variant="outline" onClick={handleErrorToast}>
                Error Toast
              </Button>
              <Button variant="outline" onClick={handleInfoToast}>
                Info Toast
              </Button>
              <Button variant="outline" onClick={handleWarningToast}>
                Warning Toast
              </Button>
            </div>
            <CodeBlock
              code={`import { toast } from 'sonner'

toast.success('Item successfully added to your cart.')
toast.error('Could not update your profile.')
toast.info('New coffee beans are now available!')
toast.warning('Your session will expire in 5 minutes.')`}
            />
          </div>
        </div>

        <div>
          <h3 className="text-muted-foreground mb-4 text-sm font-medium">Alert Dialog</h3>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={handleSuccessDialog}>
                Success Alert
              </Button>
              <Button variant="outline" onClick={handleErrorDialog}>
                Error Alert
              </Button>
            </div>
            <CodeBlock
              code={`import { useDialog } from '@/hooks/use-dialog'

const { success, error } = useDialog()

success({
  title: 'Success',
  message: 'Your order has been placed successfully!'
})

error({
  title: 'Error',
  message: 'Failed to process your request.'
})`}
            />
          </div>
        </div>

        <div>
          <h3 className="text-muted-foreground mb-4 text-sm font-medium">
            Confirmation Dialog
          </h3>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={handleConfirmDialog}>
                Confirm Action
              </Button>
            </div>
            <CodeBlock
              code={`import { useDialog } from '@/hooks/use-dialog'

const { confirm } = useDialog()

const confirmed = await confirm({
  title: 'Delete Item',
  description: 'Are you sure you want to remove this item?',
  confirmText: 'Remove',
  variant: 'destructive'
})

if (confirmed) {
  // Handle confirmation
}`}
            />
          </div>
        </div>

        <div>
          <h3 className="text-muted-foreground mb-4 text-sm font-medium">Empty State</h3>
          <div className="space-y-4">
            <div className="rounded-lg border p-12">
              <div className="flex flex-col items-center justify-center space-y-3 text-center">
                <div className="bg-muted rounded-full p-4">
                  <ShoppingCart className="text-muted-foreground h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold">Your cart is empty</p>
                  <p className="text-muted-foreground text-sm">
                    {`Looks like you haven't added any coffee yet.`}
                  </p>
                </div>
                <Button className="mt-2">Browse Products</Button>
              </div>
            </div>
            <CodeBlock
              code={`<div className="flex flex-col items-center justify-center space-y-3">
  <div className="rounded-full bg-muted p-4">
    <ShoppingCart className="h-8 w-8 text-muted-foreground" />
  </div>
  <div>
    <p className="font-semibold">Your cart is empty</p>
    <p className="text-sm text-muted-foreground">
      Looks like you haven't added any coffee yet.
    </p>
  </div>
  <Button>Browse Products</Button>
</div>`}
            />
          </div>
        </div>

        <div>
          <h3 className="text-muted-foreground mb-4 text-sm font-medium">
            Inline Messages
          </h3>
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="border-success bg-success/10 flex items-start gap-3 rounded-lg border p-3">
                <CheckCircle2 className="text-success h-5 w-5" />
                <div className="flex-1">
                  <p className="text-success text-sm font-medium">
                    Item successfully added to cart.
                  </p>
                </div>
              </div>
              <div className="border-error bg-error/10 flex items-start gap-3 rounded-lg border p-3">
                <XCircle className="text-error h-5 w-5" />
                <div className="flex-1">
                  <p className="text-error text-sm font-medium">
                    Could not update your profile.
                  </p>
                </div>
              </div>
            </div>
            <CodeBlock
              code={`<div className="flex items-start gap-3 rounded-lg border border-success bg-success/10 p-3">
  <CheckCircle2 className="h-5 w-5 text-success" />
  <p className="text-sm font-medium text-success">
    Item successfully added to cart.
  </p>
</div>`}
            />
          </div>
        </div>
      </div>
    </Section>
  );
};

export default FeedbackSection;
