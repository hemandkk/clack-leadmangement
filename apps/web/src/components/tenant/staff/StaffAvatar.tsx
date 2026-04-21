import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@leadpro/utils";

interface Props {
  name: string;
  avatar?: string;
  isOnLeave?: boolean;
  size?: "sm" | "md" | "lg";
}

const SIZE = { sm: "h-7 w-7", md: "h-9 w-9", lg: "h-12 w-12" };
const TEXT = { sm: "text-[10px]", md: "text-xs", lg: "text-sm" };

export function StaffAvatar({ name, avatar, isOnLeave, size = "md" }: Props) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative inline-block">
      <Avatar className={SIZE[size]}>
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback
          className={cn("bg-slate-800 text-white font-medium", TEXT[size])}
        >
          {initials}
        </AvatarFallback>
      </Avatar>
      {isOnLeave && (
        <span
          className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full
          bg-orange-400 border-2 border-white"
          title="On leave"
        />
      )}
    </div>
  );
}
