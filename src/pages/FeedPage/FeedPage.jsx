import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

export default function FeedPage({ user }) {
  const [feed, setFeed] = useState({ posts: [], itineraries: [] });
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [likes, setLikes] = useState({});

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const response = await fetch(`/api/feed/${user._id}`);
        const data = await response.json();
        setFeed(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch feed", error);
        setLoading(false);
      }
    };

    fetchFeed();
  }, [user]);

  const handleLike = async (id, type) => {
    try {
      await fetch(`/api/content/${type}/${id}/like/${user._id}`, {
        method: "POST",
      });
      setLikes((prevLikes) => ({ ...prevLikes, [id]: true }));
    } catch (error) {
      console.error("Failed to like", error);
    }
  };

  const handleUnlike = async (id, type) => {
    try {
      await fetch(`/api/content/${type}/${id}/unlike/${user._id}`, {
        method: "DELETE",
      });
      setLikes((prevLikes) => ({ ...prevLikes, [id]: false }));
    } catch (error) {
      console.error("Failed to unlike", error);
    }
  };

  const handleSave = async (id, type) => {
    try {
      await fetch(`/api/content/${type}/${id}/save/${user._id}`, {
        method: "POST",
      });
    } catch (error) {
      console.error("Failed to save", error);
    }
  };

  const handleUnsave = async (id, type) => {
    try {
      await fetch(`/api/content/${type}/${id}/unsave/${user._id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Failed to unsave", error);
    }
  };

  const handleAddComment = async (id, type, content) => {
    try {
      await fetch(`/api/content/${type}/${id}/comments/${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });
    } catch (error) {
      console.error("Failed to add comment", error);
    }
  };

  const FetchLikes = ({ id, type, user }) => {
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
      const fetchLikes = async () => {
        try {
          const response = await fetch(
            `/api/content/${type}/${id}/like/${user._id}`
          );
          const data = await response.json();
          setIsLiked(data.likes.includes(user._id));
        } catch (error) {
          console.error("Failed to fetch likes", error);
        }
      };

      fetchLikes();
    }, [id, type, user._id]);

    return (
      <div>
        {isLiked ? (
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleUnlike(id, type)}
          >
            Unlike
          </button>
        ) : (
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleLike(id, type)}
          >
            Like
          </button>
        )}
      </div>
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="feed-header">
        <button>
          <Link to="/post">Add New Post </Link>
        </button>
        <h2>Your Feed</h2>
      </div>
      {feed.posts.length === 0 && feed.itineraries.length === 0 ? (
        <p>No posts to display</p>
      ) : (
        <div>
          {feed.posts.map((post) => (
            <div key={post._id} className="post-box">
              <div className="post-content">
                <div className="post-header" style={{ textAlign: "center" }}>
                  <img
                    src={post.user.profilepic}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      display: "block",
                      margin: "0 auto",
                    }}
                    alt={post.user.username}
                  />
                  <div className="post-header-text">
                    <strong>{post.user.username}</strong>
                    <p>
                      <i>{post.location}</i>
                    </p>
                  </div>
                </div>
                <Carousel>
                  {post.images.map((image, index) => (
                    <div key={index}>
                      <img
                        src={image}
                        alt={`Image ${index}`}
                        style={{
                          maxWidth: "50%",
                          maxHeight: "50%",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  ))}
                </Carousel>
                <p>❤️ {post.likes.length} likes</p>
                <br />
                <div className="post-actions flex justify-center mb-4">
                  <FetchLikes id={post._id} type="posts" user={user} />
                  <button
                    className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded ml-2"
                    onClick={() => handleSave(post._id, "posts")}
                  >
                    Save
                  </button>
                  <button
                    className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded ml-2"
                    onClick={() => handleUnsave(post._id, "posts")}
                  >
                    Unsave
                  </button>
                </div>
                <div className="post-details">
                  <p>
                    <strong>Travel Dates:</strong>{" "}
                    {new Date(post.travelDates.start).toLocaleDateString()} -{" "}
                    {new Date(post.travelDates.end).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Caption:</strong> {post.caption}
                  </p>
                  <p>
                    <strong>Experience Type:</strong> {post.experienceType}
                  </p>
                  <p>
                    <strong>Tips:</strong> {post.tips}
                  </p>
                </div>
                <div className="comments-container">
                  <div className="comments-box bg-white p-4 mb-4 rounded shadow-md">
                    {post.comments.map((comment) => (
                      <p key={comment._id} className="text-left mb-2">
                        <Link to={`/profile/${comment.user._id}`}>
                          <strong className="text-blue-600">
                            {comment.user.username}
                          </strong>
                        </Link>{" "}
                        : {comment.content}
                      </p>
                    ))}
                  </div>
                  <div className="add-comment-box bg-white p-4 mb-4 rounded shadow-md">
                    <input
                      type="text"
                      placeholder="Add a comment"
                      className="w-full pl-4 pr-4 py-2 text-left"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddComment(post._id, "posts", e.target.value);
                          e.target.value = "";
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
          {feed.itineraries.map((itinerary) => (
            <div key={itinerary._id} className="post-box">
              <div className="post-content">
                <div className="post-header">
                  <img
                    src={itinerary.user.profilepic}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                    }}
                    alt={itinerary.user.username}
                  />
                  <div className="post-header-text">
                    <strong>{itinerary.user.username}</strong>
                    <p>{itinerary.location}</p>
                  </div>
                </div>
                <Carousel>
                  <div>
                    <img
                      src={itinerary.coverPhoto}
                      alt={itinerary.title}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                </Carousel>
                <p>❤️ {itinerary.likes.length} likes</p>
                <br />
                <div className="post-actions flex justify-center mb-4">
                  <FetchLikes
                    id={itinerary._id}
                    type="itineraries"
                    user={user}
                  />
                  <button
                    className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded ml-2"
                    onClick={() => handleSave(itinerary._id, "itineraries")}
                  >
                    Save
                  </button>
                  <button
                    className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded ml-2"
                    onClick={() => handleUnsave(itinerary._id, "itineraries")}
                  >
                    Unsave
                  </button>
                </div>
                <div className="post-details">
                  <p>
                    <strong>Travel Dates:</strong>{" "}
                    {new Date(itinerary.travelDates.start).toLocaleDateString()}{" "}
                    - {new Date(itinerary.travelDates.end).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Description:</strong> {itinerary.description}
                  </p>
                  <p>
                    <strong>Experience Type:</strong> {itinerary.experienceType}
                  </p>
                  <p>
                    <strong>Plan:</strong> {itinerary.plan}
                  </p>
                </div>
                <div className="comments-container">
                  <div className="comments-box bg-white p-4 mb-4 rounded shadow-md">
                    {itinerary.comments.map((comment) => (
                      <p key={comment._id} className="text-left mb-2">
                        <Link to={`/profile/${comment.user._id}`}>
                          <strong className="text-blue-600">
                            {comment.user.username}
                          </strong>
                        </Link>{" "}
                        : {comment.content}
                      </p>
                    ))}
                  </div>
                  <div className="add-comment-box bg-white p-4 mb-4 rounded shadow-md">
                    <input
                      type="text"
                      placeholder="Add a comment"
                      className="w-full pl-4 pr-4 py-2 text-left"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddComment(
                            itinerary._id,
                            "itineraries",
                            e.target.value
                          );
                          e.target.value = "";
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
