import { useEffect, useState } from "react";
import sendRequest from "../../utilities/send-request";
import { Link, useParams } from "react-router-dom";
import { getUser } from "../../utilities/users-service";

export default function Followers() {
  const { userId } = useParams();
  const [follower, setFollower] = useState([]);
  const currentUser = getUser();

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/followers`);
        const data = await response.json();
        console.log(data);
        setFollower(data);
      } catch (error) {
        console.error("Failed to fetch feed", error);
      }
    };
    fetchFollowing();
  }, [userId]);

  const handleFollow = async (userId) => {
    try {
      await sendRequest(`/api/users/${userId}/follow`, "POST");
      setFollower((prevFollowers) => [...prevFollowers, { _id: userId }]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Followers</h1>
      <ul>
        {follower.map((user) => (
          <li key={user._id}>
            <Link to={`/profile/${user._id}`}>
              <span>{user.username}</span>
            </Link>{" "}
            {currentUser._id !== user._id ? (
              <button onClick={() => handleFollow(user._id)}>Follow</button>
            ) : (
              ""
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
