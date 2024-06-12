import { useEffect, useState } from "react";
import sendRequest from "../../utilities/send-request";
import { Link, useParams } from "react-router-dom";

export default function Following() {
  const { userId } = useParams();
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/following`);
        const data = await response.json();
        console.log(data);
        setFollowing(data);
      } catch (error) {
        console.error("Failed to fetch feed", error);
      }
    };
    fetchFollowing();
  }, [userId]);

  const handleUnfollow = async (userId) => {
    try {
      await sendRequest(`/api/users/${userId}/unfollow`, "DELETE");
      setFollowing((prevFollowing) =>
        prevFollowing.filter((user) => user._id !== userId)
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Following</h1>
      <ul>
        {following.map((user) => (
          <li key={user._id}>
            <Link to={`/profile/${user._id}`}>
              <span>{user.username}</span>
            </Link>
            {" "}
            <button onClick={() => handleUnfollow(user._id)}>Unfollow</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
