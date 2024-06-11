import { Link } from "react-router-dom";
import * as userService from "../../utilities/users-service";

export default function NavBar({ setUser }) {
  const user = userService.getUser();

  function handleLogOut() {
    userService.logout();
    setUser(null);
  }
  return (
    <nav className="navbar">
      {user.isAdmin ? <Link to="/admin">Admin</Link> : ""}
      <Link to="/feed">Home</Link>
      <Link to={`/profile/${user._id}`}>Profile</Link>
      <Link to="saved">Saved</Link>
      <Link to="" onClick={handleLogOut} className="logout-link">
        Log Out
      </Link>
    </nav>
  );
}
