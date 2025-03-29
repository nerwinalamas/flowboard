"use client";

import { Task, DeleteTaskFormData, deleteTaskSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTaskModal } from "@/hooks/useTaskModal";
import { useKanbanStore } from "@/hooks/useKanbanStore";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

const DeleteTask = () => {
  const { isOpen, onClose, type, columnId, data } = useTaskModal();
  const isModalOpen = isOpen && type === "deleteTask";
  const taskData = data as Task | undefined;

  const deleteTask = useKanbanStore((state) => state.deleteTask);

  const form = useForm<DeleteTaskFormData>({
    resolver: zodResolver(deleteTaskSchema),
    defaultValues: {
      title: "",
    },
  });

  const inputValue = form.watch("title");

  const handleDialogChange = () => {
    onClose();
    form.reset();
  };

  const onSubmit = (data: DeleteTaskFormData) => {
    try {
      if (data.title !== taskData?.title) {
        toast.error("The entered text does not match the column title.");
        return;
      }

      deleteTask(taskData.id, columnId);

      toast.success("Task deleted successfully");
      handleDialogChange();
    } catch (error) {
      console.log("Error deleting task:", error);
      toast.error("Failed to delete task");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleDialogChange}>
      <DialogContent aria-describedby={undefined} className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Delete Task</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete the task.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Title Field */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      To confirm, type
                      <span className="font-semibold">
                        &quot;{taskData?.title}&quot;
                      </span>
                      below
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Type the task title"
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
                  form.formState.isSubmitting || inputValue !== taskData?.title
                }
              >
                {form.formState.isSubmitting ? "Deleting..." : "Delete Task"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteTask;
