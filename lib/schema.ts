import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  priority: z.enum(["low", "medium", "high"]),
});

export const taskWithIdSchema = taskSchema.extend({
  id: z.string(),
});

export const columnSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Column name is required"),
  tasks: z.array(taskWithIdSchema),
});

export type TaskFormData = z.infer<typeof taskSchema>;
export type Task = z.infer<typeof taskWithIdSchema>;
export type Column = z.infer<typeof columnSchema>;
