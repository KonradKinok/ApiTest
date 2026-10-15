import { NavLink } from "react-router";
import scss from "./NavigationApi.module.scss";

export function NavigationApi() {
  return (
    <nav className={scss["nav-navigation"]}>
      <NavLink
        to="api-legal-regulation-polish-page"
        className={({ isActive }) => (isActive ? scss.active : "")}
      >
        Przepisy polskie
      </NavLink>
    </nav>
  );
}
