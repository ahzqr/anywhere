import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ProfilePage() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState({});
  const [itineraries, setItineraries] = useState([]);
  const [showPosts, setShowPosts] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const { userId } = useParams();

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setUser(data.user);
        setPosts(data.posts);
        setItineraries(data.itineraries);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [userId]);

  const handleFollow = () => {
    fetch(`/api/users/${userId}/follow`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ followerId: userId }),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsFollowing(data.following);
      })
      .catch((error) => {
        console.error(error);
      });
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
          style={{ width: "50px", height: "50px" }}
        />
        <div>
          <h2>{user.username}</h2>
          <p>{user.location}</p>
          <p>{user?.following?.length} following</p>
          <p>{user?.followers?.length} followers</p>
          {isFollowing ? (
            <button onClick={handleFollow}>Unfollow</button>
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
                  <img src={image} key />
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
                  <img src={image} key />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
