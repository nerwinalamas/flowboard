import { z } from "zod";

export const taskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(30, "Title must be at most 30 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(250, "Description must be at most 250 characters"),
  priority: z.enum(["low", "medium", "high"]),
});

export const taskWithIdSchema = taskSchema.extend({
  id: z.string(),
});

export const deleteTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(30, "Title must be at most 30 characters"),
});

export const columnSchema = z.object({
  id: z.string(),
  title: z
    .string()
    .min(1, "Column name is required")
    .max(20, "Column name must be at most 20 characters"),
  tasks: z.array(taskWithIdSchema),
});

export type TaskFormData = z.infer<typeof taskSchema>;
export type Task = z.infer<typeof taskWithIdSchema>;
export type DeleteTaskFormData = z.infer<typeof deleteTaskSchema>;
export type Column = z.infer<typeof columnSchema>;
