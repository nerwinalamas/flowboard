"use client";

import { useState } from "react";
import { Task } from "@/lib/schema";
import { useTaskModal } from "@/hooks/useTaskModal";
import { Link2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ShareTask = () => {
  const { isOpen, onClose, type, columnId, data } = useTaskModal();
  const isModalOpen = isOpen && type === "shareTask";
  const taskData = data as Task | undefined;
  let shareUrl = "";

  const [copied, setCopied] = useState(false);

  if (isModalOpen && taskData) {
    shareUrl = `http://localhost:3000/${columnId}/${taskData.id}`;
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleDialogChange = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Task</DialogTitle>
          <DialogDescription>
            Anyone with the link can view this task
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center border rounded-md overflow-hidden">
          <div className="flex items-center pl-3">
            <Link2 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1 px-3 py-2 text-sm truncate">{shareUrl}</div>
          <Button
            type="button"
            variant="secondary"
            className="rounded-none h-full border-l px-3"
            onClick={copyToClipboard}
          >
            {copied ? (
              <span className="text-sm font-medium">Copied!</span>
            ) : (
              <span className="text-sm font-medium">Copy</span>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareTask;
