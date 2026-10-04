import type { HTMLAttributes, ReactNode } from "react";
import "./Container.css";

type ContainerSize = "sm" | "md" | "lg" | "xl" | "2xl";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  size?: ContainerSize;
}

export function Container({
  children,
  size = "xl",
  className = "",
  ...props
}: ContainerProps) {
  const classes = [
    "ui-container",
    `ui-container--${size}`,
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