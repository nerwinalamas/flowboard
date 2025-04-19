"use client";

import { useState } from "react";
import { getInitials } from "@/lib/utils";
import { useUserStore } from "@/hooks/useUserStore";
import { MoreHorizontal, Search, UserRoundX } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { useUserDrawer } from "@/hooks/useUserDrawer";

const TeamMembersDrawer = () => {
  const { isOpen, type, onClose } = useUserDrawer();
  const isUserDrawerOpen = isOpen && type === "viewMembers";

  const users = useUserStore((state) => state.users);
  const removeUser = useUserStore((state) => state.removeUser);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDialogChange = () => {
    onClose();
  };

  return (
    <Sheet open={isUserDrawerOpen} onOpenChange={handleDialogChange}>
      <SheetContent className="w-sm gap-0">
        <SheetHeader>
          <SheetTitle>Team Members</SheetTitle>
          <SheetDescription>
            View and manage all team collaborators
          </SheetDescription>
        </SheetHeader>

        <div className="p-4 w-full">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search"
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {filteredUsers.length > 0 ? (
            <div className="mt-4 flex flex-col">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-2 justify-between p-2 rounded-md hover:bg-accent/40 hover:cursor-pointer transition-colors duration-200 ease-in-out"
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="text-sm bg-muted">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm capitalize">{user.name}</span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 hover:cursor-pointer"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {/* <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => console.log("View User")}
                      >
                        <User className="mr-2 h-4 w-4" />
                        View Profile
                      </DropdownMenuItem> */}
                      <DropdownMenuItem
                        className="cursor-pointer text-red-600 focus:text-red-600"
                        onClick={() => removeUser(user.id)}
                      >
                        <UserRoundX className="mr-2 h-4 w-4" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground gap-2">
              <Search className="h-6 w-6" />
              <p>No users found</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TeamMembersDrawer;
