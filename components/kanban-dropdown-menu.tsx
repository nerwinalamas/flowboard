import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LucideIcon, MoreHorizontal } from "lucide-react";

export type DropdownMenuItem = {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  className?: string;
};

interface KanbanDropdownMenuProps {
  items: DropdownMenuItem[];
  className?: string;
}

const KanbanDropdownMenu = ({ items, className }: KanbanDropdownMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`h-6 w-6 hover:cursor-pointer ${
            className || ""
          }`}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {items.map((item, index) => (
          <DropdownMenuItem
            key={index}
            onClick={item.onClick}
            className={`cursor-pointer ${item.className || ""}`}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default KanbanDropdownMenu;
