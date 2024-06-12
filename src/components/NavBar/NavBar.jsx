import { Link, useNavigate } from "react-router-dom";
import * as userService from "../../utilities/users-service";
import { useState } from "react";

export default function NavBar({ setUser }) {
  const [searchQuery, setSearchQuery] = useState("");
  const user = userService.getUser();
  const navigate = useNavigate();

  function handleLogOut() {
    userService.logout();
    setUser(null);
  }

  const handleChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/search?q=${searchQuery}`); 
    }
  };

  return (
    <nav className="navbar">
      {user.isAdmin ? <Link to="/admin">Admin</Link> : ""}
      <Link to="/feed">Home</Link>
      <Link to={`/profile/${user._id}`}>Profile</Link>
      <Link to="saved">Saved</Link>
      <Link to="" onClick={handleLogOut} className="logout-link">
        Log Out
      </Link>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search by location or username"
          value={searchQuery}
          onChange={handleChange}
        />
        <button type="submit">Search</button>
      </form>
    </nav>
  );
}
