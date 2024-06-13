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
    <nav className="flex justify-between items-center py-4 px-6 bg-gray-100 shadow-md">
      <div className="flex items-center">
        {user.isAdmin ? (
          <Link to="/admin" className="text-gray-600 hover:text-gray-900">
            Admin
          </Link>
        ) : (
          ""
        )}
        <Link to="/feed" className="text-gray-600 hover:text-gray-900 ml-4">
          Home
        </Link>
        <Link
          to={`/profile/${user._id}`}
          className="text-gray-600 hover:text-gray-900 ml-4"
        >
          Profile
        </Link>
        <Link to="saved" className="text-gray-600 hover:text-gray-900 ml-4">
          Saved
        </Link>
      </div>
      <div className="flex items-center">
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            type="text"
            placeholder="Search by location or username"
            value={searchQuery}
            onChange={handleChange}
            className="w-full p-2 pl-10 text-sm text-gray-700"
          />
          <button
            type="submit"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
          >
            Search
          </button>
        </form>
        <Link
          to=""
          onClick={handleLogOut}
          className="text-gray-600 hover:text-gray-900 ml-4 logout-link"
        >
          Log Out
        </Link>
      </div>
    </nav>
  );
}
