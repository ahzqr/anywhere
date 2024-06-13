import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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
        const data = await sendRequest(
          `/api/users/${userId}/followingstatus`,
          "GET"
        );
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
    <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-12">
      <div className="flex flex-wrap justify-center mb-4">
        <img
          src={user.profilepic}
          alt={user.username}
          className="w-48 h-48 rounded-full mr-4"
        />
        <div className="flex-1 flex flex-col" >
          <h2 className="text-2xl font-bold">{user.username}</h2>
          <p className="text-gray-600">{user?.bio}</p>
          <div className="flex  mb-4">
            <Link to={`/profile/${user?._id}/following`}>
              <p className="text-gray-600">
                {user?.following?.length} following
              </p>
            </Link>
            <span>&nbsp;|&nbsp;</span>
            <Link to={`/profile/${user?._id}/followers`}>
              <p className="text-gray-600">
                {user?.followers?.length} followers
              </p>
            </Link>
          </div>
          {currentUser._id === userId ? (
            ""
          ) : isFollowing ? (
            <button
              onClick={handleUnfollow}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Unfollow
            </button>
          ) : (
            <button
              onClick={handleFollow}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Follow
            </button>
          )}
          {currentUser._id === userId ? (
            <Link to={`/profile/${currentUser._id}/editprofile`}>
              <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">
                Edit Profile
              </button>
            </Link>
          ) : (
            ""
          )}
        </div>
      </div>

      <div className="flex justify-center mb-4">
        <button
          onClick={() => handleToggle("posts")}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded mr-2"
        >
          Posts
        </button>
        <button
          onClick={() => handleToggle("itineraries")}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
        >
          Itineraries
        </button>
      </div>

      {showPosts ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <div key={post._id} className="bg-white p-4 rounded shadow-md">
              <Link to={`/post/${post._id}`}>
                {post.images.map((image) => (
                  <img
                    src={image}
                    key={image}
                    className="w-full h-48 object-cover rounded-t-md"
                  />
                ))}
              </Link>
              <p className="text-gray-600">{post.caption}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {itineraries.map((itinerary) => (
            <div key={itinerary._id} className="bg-white p-4 rounded shadow-md">
              <Link to={`/itinerary/${itinerary._id}`}>
                {itinerary.coverPhoto.map((image) => (
                  <img
                    src={image}
                    key={itinerary._id}
                    className="w-full h-48 object-cover rounded-t-md"
                  />
                ))}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
