import { useUserStore } from "@/hooks/useUserStore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

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
          <Avatar key={user.id} className="h-9 w-9 border-2 border-background hover:border-primary hover:cursor-pointer transition-colors duration-200 ease-in-out">
            <AvatarFallback className="text-sm bg-muted">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        ))}
        {extraCount > 0 && (
          <Avatar className="h-9 w-9 border-2 border-background hover:border-primary hover:cursor-pointer transition-colors duration-200 ease-in-out">
            <AvatarFallback className="text-sm bg-muted">
              +{extraCount}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
};

export default TeamAvatars;
