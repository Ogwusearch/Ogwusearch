import type { HTMLAttributes, ReactNode } from "react";
import "./Card.css";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  interactive?: boolean;
}

export function Card({
  children,
  interactive = false,
  className = "",
  ...props
}: CardProps) {
  const classes = [
    "ui-card",
    interactive ? "ui-card--interactive" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}