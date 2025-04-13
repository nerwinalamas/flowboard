import { useUserStore } from "@/hooks/useUserStore";
import { getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import TeamMembers from "./team-members";

const TeamAvatars = ({ maxVisible = 3 }) => {
  const users = useUserStore((state) => state.users);

  if (users.length === 0) {
    return null;
  }

  const visibleUsers = users.slice(0, maxVisible);
  const extraCount = users.length > maxVisible ? users.length - maxVisible : 0;

  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {visibleUsers.map((user) => (
          <HoverCard key={user.id}>
            <HoverCardTrigger>
              <Avatar className="h-9 w-9 border-2 border-background hover:border-primary hover:cursor-pointer transition-colors duration-200 ease-in-out">
                <AvatarFallback className="text-sm bg-muted">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
            </HoverCardTrigger>
            <HoverCardContent align="start" className="w-80">
              <div className="flex items-center gap-2">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="text-sm">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{user.name}</span>
              </div>
            </HoverCardContent>
          </HoverCard>
        ))}
        {extraCount > 0 && <TeamMembers extraCount={extraCount} />}
      </div>
    </div>
  );
};

export default TeamAvatars;
