"use client";

import { useEffect } from "react";
import { taskSchema, TaskFormData, Task } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTaskModal } from "@/hooks/useTaskModal";
import { useKanbanStore } from "@/hooks/useKanbanStore";
import { useUserStore } from "@/hooks/useUserStore";
import { useForm } from "react-hook-form";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const EditTask = () => {
  const { isOpen, onClose, type, columnId, data } = useTaskModal();
  const isModalOpen = isOpen && type === "editTask";
  const taskData = data as Task | undefined;

  const editTask = useKanbanStore((state) => state.editTask);
  const users = useUserStore((state) => state.users);

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "low",
      assigneeId: undefined,
      dueDate: undefined,
    },
  });

  useEffect(() => {
    if (isModalOpen && taskData) {
      form.reset({
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        assigneeId: taskData.assigneeId,
        dueDate: taskData.dueDate,
      });
    }
  }, [isModalOpen, taskData, form]);

  const handleDialogChange = () => {
    onClose();
    form.reset();
  };

  const onSubmit = (data: TaskFormData) => {
    try {
      const taskUpdatedData: Task = {
        id: taskData?.id || "",
        title: data.title.trim(),
        description: data.description.trim(),
        priority: data.priority,
        assigneeId: data.assigneeId,
        dueDate: data.dueDate,
        isArchived: false,
        archivedAt: undefined,
      };

      editTask(taskUpdatedData.id, columnId, taskUpdatedData);

      toast.success("Task updated successfully");
      handleDialogChange();
    } catch (error) {
      console.log("Error updating task:", error);
      toast.error("Failed to update task");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
              <DialogDescription>
                Modify task information including title, description, and
                priority level.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Title Field */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Task title"
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description Field */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Task description"
                        rows={3}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Assignee Field */}
              <FormField
                control={form.control}
                name="assigneeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignee</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={form.formState.isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full dark:bg-transparent">
                          <SelectValue placeholder="Select an assignee" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem
                            key={user.id}
                            value={user.id}
                            className="capitalize"
                          >
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Due Date Field */}
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className="pl-3 text-left font-normal"
                            disabled={form.formState.isSubmitting}
                          >
                            {field.value ? (
                              format(field.value, "MMMM dd, yyyy")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Priority Field */}
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                        disabled={form.formState.isSubmitting}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="low" id="low" />
                          <Label htmlFor="low" className="cursor-pointer">
                            Low
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="medium" id="medium" />
                          <Label htmlFor="medium" className="cursor-pointer">
                            Medium
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="high" id="high" />
                          <Label htmlFor="high" className="cursor-pointer">
                            High
                          </Label>
                        </div>
                      </RadioGroup>
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
                {form.formState.isSubmitting ? "Updating..." : "Update Task"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTask;
