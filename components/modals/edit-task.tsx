"use client";

import { useEffect, useState } from "react";
import { Task } from "@/lib/types";
import { useTaskModal } from "@/hooks/useTaskModal";
import { useKanbanStore } from "@/hooks/useKanbanStore";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

type Priority = "low" | "medium" | "high";

const EditTask = () => {
  const { isOpen, onClose, type, columnId, data } = useTaskModal();
  const isModalOpen = isOpen && type === "editTask";
  const taskData = data as Task | undefined;

  const editTask = useKanbanStore((state) => state.editTask);

  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("low");

  useEffect(() => {
    if (isModalOpen && taskData) {
      setId(taskData.id);
      setTitle(taskData.title);
      setDescription(taskData.description);
      setPriority(taskData.priority as Priority);
    }
  }, [isModalOpen, taskData]);

  const handleDialogChange = () => {
    onClose();

    setTitle("");
    setDescription("");
    setPriority("low");
  };

  const handlePriorityChange = (value: string) => {
    setPriority(value as Priority);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Task title is required");
      return;
    }

    if (!description.trim()) {
      toast.error("Task description is required");
      return;
    }

    try {
      const taskUpdatedData = {
        id,
        title: title.trim(),
        description: description.trim(),
        priority,
      };

      editTask(id, columnId, taskUpdatedData);

      toast.success("Task updated successfully");
      handleDialogChange();
    } catch (error) {
      console.log("Error updating task:", error);
      toast.error("Failed to update task");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleDialogChange}>
      <DialogContent aria-describedby={undefined} className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Task description"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label>Priority</Label>
              <RadioGroup
                value={priority}
                onValueChange={handlePriorityChange}
                className="flex space-x-4"
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
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleDialogChange}
            >
              Cancel
            </Button>
            <Button type="submit">Update Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTask;
