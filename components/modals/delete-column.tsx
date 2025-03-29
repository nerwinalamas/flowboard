"use client";

import { Column, Column as ColumnFormData, columnSchema } from "@/lib/schema";
import { useColumnModal } from "@/hooks/useColumnModal";
import { useKanbanStore } from "@/hooks/useKanbanStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

const DeleteColumn = () => {
  const { isOpen, onClose, type, data } = useColumnModal();
  const isModalOpen = isOpen && type === "deleteColumn";
  const columnData = data as Column | undefined;

  const deleteColumn = useKanbanStore((state) => state.deleteColumn);

  const form = useForm<ColumnFormData>({
    resolver: zodResolver(columnSchema),
    defaultValues: {
      id: "",
      title: "",
      tasks: [],
    },
  });

  const inputValue = form.watch("title");

  const handleDialogChange = () => {
    onClose();
    form.reset();
  };

  const onSubmit = (data: ColumnFormData) => {
    try {
      if (data.title !== columnData?.title) {
        toast.error("The entered text does not match the column title.");
        return;
      }

      deleteColumn(columnData.id);

      toast.success("Column deleted successfully");
      handleDialogChange();
    } catch (error) {
      console.log("Error deleting column:", error);
      toast.error("Failed to delete column");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Delete Column</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete the
                column and all its tasks
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Column Name Field */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      To confirm, type
                      <span className="font-semibold">
                        &quot;{columnData?.title}&quot;
                      </span>
                      below
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Type the column title"
                        autoComplete="off"
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleDialogChange}
                disabled={form.formState.isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                type="submit"
                disabled={
                  form.formState.isSubmitting ||
                  inputValue !== columnData?.title
                }
              >
                {form.formState.isSubmitting ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteColumn;
