import { NavLink } from "react-router";
import scss from "./NavigationApi.module.scss";

export function NavigationApi() {
  return (
    <nav className={scss["nav-navigation"]}>
      <NavLink
        to="api-legal-regulation-polish-page"
        className={({ isActive }) => (isActive ? scss.active : "")}
      >
        API Przepisy polskie
      </NavLink>
      <NavLink
        to="display-legal-regulation-polish-page"
        className={({ isActive }) => (isActive ? scss.active : "")}
      >
        Pokaż przepisy polskie
      </NavLink>
    </nav>
  );
}
