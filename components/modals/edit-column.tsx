"use client";

import { useEffect } from "react";
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

const EditColumn = () => {
  const { isOpen, onClose, type, data } = useColumnModal();
  const isModalOpen = isOpen && type === "editColumn";
  const columnData = data as Column | undefined;

  const editColumn = useKanbanStore((state) => state.editColumn);

  const form = useForm<ColumnFormData>({
    resolver: zodResolver(columnSchema),
    defaultValues: {
      id: "",
      title: "",
      tasks: [],
    },
  });

  useEffect(() => {
    if (isModalOpen && columnData) {
      form.reset({
        id: columnData.id,
        title: columnData.title,
        tasks: columnData.tasks,
      });
    }
  }, [isModalOpen, columnData, form]);

  const handleDialogChange = () => {
    onClose();
    form.reset();
  };

  const onSubmit = (data: ColumnFormData) => {
    try {
      editColumn(data.id, { title: data.title });

      toast.success("Column updated successfully");
      handleDialogChange();
    } catch (error) {
      console.log("Error updating column:", error);
      toast.error("Failed to update column");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Edit Column</DialogTitle>
              <DialogDescription>
                Choose a descriptive name that represents the workflow stage.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Column Name Field */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Column Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., Backlog, Review, Testing"
                        autoFocus
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
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditColumn;
