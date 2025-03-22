"use client";

import { Column as ColumnFormData, columnSchema } from "@/lib/schema";
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


const CreateColumn = () => {
  const { isOpen, onClose, type } = useColumnModal();
  const isModalOpen = isOpen && type === "createColumn";

   const addColumn = useKanbanStore((state) => state.addColumn);

  const form = useForm<ColumnFormData>({
    resolver: zodResolver(columnSchema),
    defaultValues: {
      id: "",
      title: "",
      tasks: [],
    },
  });

  const handleDialogChange = () => {
    onClose();
    form.reset();
  };

  const onSubmit = (data: ColumnFormData) => {
    try {
      const newColumn = {
        ...data,
        id: `column-${Date.now()}`,
      };

      addColumn(newColumn);

      toast.success("Column added successfully");
      handleDialogChange();
    } catch (error) {
      console.log("Error creating column:", error);
      toast.error("Failed to create column");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Add New Column</DialogTitle>
              <DialogDescription>
                Create a new column to organize your tasks.
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
              >
                Cancel
              </Button>
              <Button type="submit">Add Column</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateColumn;
