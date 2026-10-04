export interface NavigationItem {
  label: string;
  href: string;
}

export const navigation: NavigationItem[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Projects",
    href: "/projects",
  },
  {
    label: "Experiments",
    href: "/experiments",
  },
  {
    label: "Writing",
    href: "/writing",
  },
  {
    label: "About",
    href: "/about",
  },
];