import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function SearchResults() {
  const location = useLocation();
  const [searchResults, setSearchResults] = useState({ posts: [], users: [] });
  const q = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await fetch(`/api/search?q=${q}`);
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    fetchSearchResults();
  }, [q]);

  return (
    <div>
      <h2>Search Results</h2>
      {searchResults.posts.length > 0 && (
        <div>
          <h3>Posts</h3>
          {searchResults.posts.map((post) => (
            <div key={post._id}>
              <h5>
                <strong>{post.user.username}</strong>
              </h5>
              <p>{post.location}</p>
              <p>{post.caption}</p>
              <Link to={`/post/${post._id}`}>View Post</Link>
            </div>
          ))}
        </div>
      )}
      {searchResults.users.length > 0 && (
        <div>
          <h3>Users</h3>
          {searchResults.users.map((user) => (
            <div key={user._id}>
              <h5>
                <strong>{user.username}</strong>
              </h5>
              <Link to={`/profile/${user._id}`}>View Profile</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
