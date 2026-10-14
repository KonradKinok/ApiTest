import { NavLink } from "react-router";
import scss from "./Navigation.module.scss";

export function Navigation() {
  return (
    <nav className={scss["nav-navigation"]}>
      <NavLink
        to="/"
        className={({ isActive }) => (isActive ? scss.active : "")}
        // onClick={}
      >
        Home
      </NavLink>

      <NavLink
        to="api-legal-regulation-polish-page"
        className={({ isActive }) => (isActive ? scss.active : "")}
      >
        Przepisy polskie
      </NavLink>

      <NavLink
        to="legalregulations"
        className={({ isActive }) => (isActive ? scss.active : "")}
      >
        inne 2
      </NavLink>
    </nav>
  );
}
