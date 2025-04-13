"use client";

import { User as UserFormData, userSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserModal } from "@/hooks/useUserModal";
import { useUserStore } from "@/hooks/useUserStore";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

const CreateUser = () => {
  const { isOpen, onClose, type } = useUserModal();
  const isModalOpen = isOpen && type === "createUser";

  const addUser = useUserStore((state) => state.addUser);

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      id: "",
      name: "",
    },
  });

  const handleDialogChange = () => {
    onClose();
    form.reset();
  };

  const onSubmit = (data: UserFormData) => {
    try {
      const userData: UserFormData = {
        id: `user-${data.name.toLowerCase().replace(/\s+/g, "-")}`,
        name: data.name.trim(),
      };

      addUser(userData);

      toast.success("User created successfully");
      handleDialogChange();
    } catch (error) {
      console.log("Error creating user:", error);
      toast.error("Failed to create user");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Add a new user to the system. Click save when you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter Name"
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
                {form.formState.isSubmitting ? "Creating..." : "Create User"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUser;
