import type { HTMLAttributes, ReactNode } from "react";
import "./Section.css";

type SectionSpacing = "sm" | "md" | "lg";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  spacing?: SectionSpacing;
}

export function Section({
  children,
  spacing = "lg",
  className = "",
  ...props
}: SectionProps) {
  const classes = [
    "ui-section",
    `ui-section--${spacing}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={classes} {...props}>
      {children}
    </section>
  );
}