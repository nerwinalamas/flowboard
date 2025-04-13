"use client";

import { getInitials } from "@/lib/utils";
import { Priority, useKanbanStore } from "@/hooks/useKanbanStore";
import { useUserStore } from "@/hooks/useUserStore";
import { Filter, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import TeamAvatars from "./team-avatars";

const PRIORITY_DROPDOWN_MENU: Priority[] = ["high", "medium", "low"];

const KanbanFilter = () => {
  const {
    searchQuery,
    setSearchQuery,
    priorityFilter,
    setPriorityFilter,
    assigneeFilter,
    setAssigneeFilter,
    showUnassigned,
    setShowUnassigned,
    toggleUnassigned,
  } = useKanbanStore();
  const { users } = useUserStore();

  const handlePriorityChange = (priority: Priority) => {
    setPriorityFilter(
      priorityFilter.includes(priority)
        ? priorityFilter.filter((p) => p !== priority)
        : [...priorityFilter, priority]
    );
  };

  const handleAssigneeChange = (userId: string) => {
    setAssigneeFilter(
      assigneeFilter.includes(userId)
        ? assigneeFilter.filter((id) => id !== userId)
        : [...assigneeFilter, userId]
    );
  };

  const handleClearAll = () => {
    setSearchQuery("");
    setPriorityFilter([]);
    setAssigneeFilter([]);
    setShowUnassigned(false);
  };

  const hasActiveFilters =
    searchQuery ||
    priorityFilter.length > 0 ||
    assigneeFilter.length > 0 ||
    showUnassigned;

  return (
    <div className="p-4 flex gap-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder="Search tasks..."
          className="pl-8 w-80"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Filter tasks..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Priority">
                {PRIORITY_DROPDOWN_MENU.map((priority) => (
                  <CommandItem
                    key={priority}
                    onSelect={() => handlePriorityChange(priority)}
                    className="capitalize"
                  >
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={priorityFilter.includes(priority)}
                        onCheckedChange={() => handlePriorityChange(priority)}
                      />
                      <span>{priority}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Assignees">
                {users.map((user) => (
                  <CommandItem
                    key={user.id}
                    onSelect={() => handleAssigneeChange(user.id)}
                  >
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={assigneeFilter.includes(user.id)}
                        onCheckedChange={() => handleAssigneeChange(user.id)}
                      />
                      <div className="flex items-center gap-1">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="text-[10px]">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="capitalize">{user.name}</span>
                      </div>
                    </div>
                  </CommandItem>
                ))}
                <CommandItem onSelect={toggleUnassigned}>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={showUnassigned}
                      onCheckedChange={toggleUnassigned}
                    />
                    <div className="flex items-center gap-1">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="text-[10px]">
                          UT
                        </AvatarFallback>
                      </Avatar>
                      <span>Unassigned Task</span>
                    </div>
                  </div>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
          <div className="p-2 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-center text-muted-foreground hover:text-foreground"
              onClick={handleClearAll}
              disabled={!hasActiveFilters}
            >
              Clear all filters
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      <TeamAvatars />
    </div>
  );
};

export default KanbanFilter;
