import { Priority, useKanbanStore } from "@/hooks/useKanbanStore";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Filter, Search } from "lucide-react";

const PRIORITY_DROPDOWN_MENU: Priority[] = ["all", "high", "medium", "low"];

const KanbanFilter = () => {
  const { searchQuery, setSearchQuery, setPriorityFilter } = useKanbanStore();

  return (
    <div className="flex gap-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="text"
          placeholder="Search tasks..."
          className="pl-8 w-80"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {PRIORITY_DROPDOWN_MENU.map((item) => (
            <DropdownMenuItem
              key={item}
              onClick={() => setPriorityFilter(item)}
              className="capitalize"
            >
              {item}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default KanbanFilter;
