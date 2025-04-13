"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useUserStore } from "@/hooks/useUserStore";
import { getInitials } from "@/lib/utils";

interface TeamMembersProps {
  extraCount: number;
}

const TeamMembers = ({ extraCount }: TeamMembersProps) => {
  const users = useUserStore((state) => state.users);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Avatar className="h-9 w-9 border-2 border-background hover:border-primary hover:cursor-pointer transition-colors duration-200 ease-in-out">
          <AvatarFallback className="text-sm bg-muted">
            +{extraCount}
          </AvatarFallback>
        </Avatar>
      </SheetTrigger>
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
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-accent/40 hover:cursor-pointer transition-colors duration-200 ease-in-out"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="text-sm bg-muted">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm capitalize">{user.name}</span>
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

export default TeamMembers;
