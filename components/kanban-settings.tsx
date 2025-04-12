"use client";

import { useKanbanStore } from "@/hooks/useKanbanStore";
import { Archive, Eye, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";

const KanbanSettings = () => {
  const { viewOptions, setViewOption, showArchived, toggleShowArchived } =
    useKanbanStore();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings2 className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-sm">
        <SheetHeader>
          <SheetTitle>FlowBoard Settings</SheetTitle>
          <SheetDescription>
            Configure your board view and visibility options.
          </SheetDescription>
        </SheetHeader>

        <div className="p-4 overflow-auto w-full">
          <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
            <Archive className="h-4 w-4" />
            Archive Settings
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="show-archived-tasks" className="text-sm">
                  Show archived tasks and columns
                </Label>
                <p className="text-xs text-muted-foreground">
                  Display tasks and columns that have been archived
                </p>
              </div>
              <Switch
                id="show-archived"
                checked={showArchived}
                onCheckedChange={toggleShowArchived}
              />
            </div>

            {/* <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="show-archived-tasks" className="text-sm">
                  Show archived tasks
                </Label>
                <p className="text-xs text-muted-foreground">
                  Display tasks that have been archived
                </p>
              </div>
              <Switch id="show-archived-tasks" />
            </div> */}

            {/* <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="show-archived-columns" className="text-sm">
                  Show archived columns
                </Label>
                <p className="text-xs text-muted-foreground">
                  Display columns that have been archived
                </p>
              </div>
              <Switch id="show-archived-columns" />
            </div> */}
          </div>

          <Separator className="my-6" />

          <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
            <Eye className="h-4 w-4" />
            View Options
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="show-description" className="text-sm">
                  Show description
                </Label>
                <p className="text-xs text-muted-foreground">
                  Display task descriptions on cards
                </p>
              </div>
              <Switch
                defaultChecked
                checked={viewOptions.showDescription}
                onCheckedChange={(checked) =>
                  setViewOption("showDescription", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="show-priority" className="text-sm">
                  Show priority
                </Label>
                <p className="text-xs text-muted-foreground">
                  Display priority labels on task cards
                </p>
              </div>
              <Switch
                id="show-priority"
                checked={viewOptions.showPriority}
                onCheckedChange={(checked) =>
                  setViewOption("showPriority", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="show-due-dates" className="text-sm">
                  Show due dates
                </Label>
                <p className="text-xs text-muted-foreground">
                  Display task deadlines on cards
                </p>
              </div>
              <Switch
                id="show-due-dates"
                checked={viewOptions.showDueDates}
                onCheckedChange={(checked) =>
                  setViewOption("showDueDates", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="show-assignees" className="text-sm">
                  Show assignees
                </Label>
                <p className="text-xs text-muted-foreground">
                  Display assigned users on task cards
                </p>
              </div>
              <Switch
                id="show-assignees"
                checked={viewOptions.showAssignees}
                onCheckedChange={(checked) =>
                  setViewOption("showAssignees", checked)
                }
              />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default KanbanSettings;
