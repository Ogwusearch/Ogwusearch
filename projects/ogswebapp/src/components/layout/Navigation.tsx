import { NavLink } from "react-router-dom";

import { navigation } from "../../data/navigation";

interface NavigationProps {
  mobile?: boolean;
  onNavigate?: () => void;
}

export function Navigation({
  mobile = false,
  onNavigate,
}: NavigationProps) {
  return (
    <nav
      className={
        mobile
          ? "navigation navigation--mobile"
          : "navigation"
      }
      aria-label="Primary navigation"
    >
      <ul className="navigation__list">
        {navigation.map((item) => (
          <li
            key={item.href}
            className="navigation__item"
          >
            <NavLink
              to={item.href}
              onClick={onNavigate}
              className={({ isActive }) =>
                `navigation__link ${
                  isActive
                    ? "navigation__link--active"
                    : ""
                }`
              }
              end={item.href === "/"}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}