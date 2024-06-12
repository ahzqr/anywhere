import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUser } from "../../utilities/users-service";
import sendRequest from "../../utilities/send-request";

export default function ProfilePage() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState({});
  const [itineraries, setItineraries] = useState([]);
  const [showPosts, setShowPosts] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const { userId } = useParams();
  const currentUser = getUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await sendRequest(`/api/users/${userId}`, "GET");
        setUser(data.user);
        setPosts(data.posts);
        setItineraries(data.itineraries);
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    };
    fetchData();
  }, [userId]);

  useEffect(() => {
    const checkFollowing = async () => {
      try {
        const data = await sendRequest(`/api/users/${userId}/following`, "GET");
        setIsFollowing(data.following);
      } catch (error) {
        console.error(error);
      }
    };
    if (userId !== currentUser._id) {
      checkFollowing();
    }
  }, [currentUser._id, userId]);

  const handleFollow = async () => {
    try {
      const data = await sendRequest(`/api/users/${userId}/follow`, "POST");
      setIsFollowing(data.following);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUnfollow = async () => {
    try {
      const data = await sendRequest(`/api/users/${userId}/unfollow`, "DELETE");
      setIsFollowing(data.following);
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggle = (type) => {
    setShowPosts(type === "posts");
  };

  return (
    <div>
      <div>
        <img
          src={user.profilepic}
          alt={user.username}
          style={{ width: "150px", height: "150px" }}
        />
        <div>
          <h2>{user.username}</h2>
          <p>{user.location}</p>
          <p>{user?.following?.length} following</p>
          <p>{user?.followers?.length} followers</p>
          {currentUser._id === userId ? (
            ""
          ) : isFollowing ? (
            <button onClick={handleUnfollow}>Unfollow</button>
          ) : (
            <button onClick={handleFollow}>Follow</button>
          )}
        </div>
      </div>

      <div>
        <button onClick={() => handleToggle("posts")}>Posts</button>
        <button onClick={() => handleToggle("itineraries")}>Itineraries</button>

        {showPosts ? (
          <div>
            {posts.map((post) => (
              <div key={post._id}>
                {post.images.map((image) => (
                  <img src={image} key={post._id} />
                ))}
                <p>{post.caption}</p>
              </div>
            ))}
          </div>
        ) : (
          <div>
            {itineraries.map((itinerary) => (
              <div key={itinerary._id}>
                {itinerary.coverPhoto.map((image) => (
                  <img src={image} key={itinerary._id} />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
