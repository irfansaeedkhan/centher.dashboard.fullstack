import React from "react";
import type { TypingUser } from "@/lib/chat/types";

/** "Leo is typing…" indicator with animated dots. */
export const TypingIndicator: React.FC<{ users: TypingUser[] }> = ({
  users,
}) => {
  if (users.length === 0) return null;
  const names = users
    .map((u) => u.display_name || "Someone")
    .slice(0, 3)
    .join(", ");
  const more = users.length > 3 ? ` +${users.length - 3}` : "";
  return (
    <div className="flex items-center gap-2 px-1 py-1">
      <span className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-shade-7"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </span>
      <span className="text-xs italic text-gray-shade-7">
        {names}
        {more} {users.length === 1 ? "is" : "are"} typing…
      </span>
    </div>
  );
};
