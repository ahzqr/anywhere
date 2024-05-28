import { Link } from "react-router-dom";
import * as userService from "../../utilities/users-service";

export default function NavBar({ setUser }) {
  function handleLogOut() {
    userService.logout();
    setUser(null);
  }
  return (
    <nav className="navbar">
      <Link to="" onClick={handleLogOut} className="logout-link">
        Log Out
      </Link>
    </nav>
  );
}
