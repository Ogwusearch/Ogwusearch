import type { HTMLAttributes, ReactNode } from "react";
import "./Badge.css";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
}

export function Badge({
  children,
  className = "",
  ...props
}: BadgeProps) {
  const classes = ["ui-badge", className]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
}