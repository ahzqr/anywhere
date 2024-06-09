import { useEffect, useState } from "react";

export default function FeedPage({ user }) {
  const [feed, setFeed] = useState({ posts: [], itineraries: [] });
  const [loading, setLoading] = useState(true);

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
    } catch (error) {
      console.error("Failed to like", error);
    }
  };

  const handleUnlike = async (id, type) => {
    try {
      await fetch(`/api/content/${type}/${id}/unlike/${user._id}`, {
        method: "DELETE",
      });
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Your Feed</h2>
      {feed.posts.length === 0 && feed.itineraries.length === 0 ? (
        <p>No posts to display</p>
      ) : (
        <div>
          {feed.posts.map((post) => (
            <div key={post._id}>
              <h3>{post.caption}</h3>
              <img src={post.images[0]} alt={post.caption} />
              <p>{post.location}</p>
              <p>{new Date(post.travelDates).toLocaleDateString()}</p>
              <p>{post.experienceType}</p>
              <p>{post.tips}</p>
              <button onClick={() => handleLike(post._id, "posts")}>
                Like
              </button>
              <button onClick={() => handleUnlike(post._id, "posts")}>
                Unlike
              </button>
              <button onClick={() => handleSave(post._id, "posts")}>
                Save
              </button>
              <button onClick={() => handleUnsave(post._id, "posts")}>
                Unsave
              </button>
              <div>
                <input
                  type="text"
                  placeholder="Add a comment"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddComment(post._id, "posts", e.target.value);
                      e.target.value = "";
                    }
                  }}
                />
              </div>

              {post.comments.map((comment) => (
                <div key={comment._id}>
                  <p>
                    {comment.user.username}: {comment.content}
                  </p>
                </div>
              ))}
            </div>
          ))}
          {feed.itineraries.map((itinerary) => (
            <div key={itinerary._id}>
              <h3>{itinerary.title}</h3>
              <img src={itinerary.coverPhoto} alt={itinerary.title} />
              <p>{itinerary.description}</p>
              <p>{itinerary.location}</p>
              <p>{new Date(itinerary.travelDates).toLocaleDateString()}</p>
              <p>{itinerary.experienceType}</p>
              <div>
                {itinerary.plan.map((dayPlan, index) => (
                  <div key={index}>
                    <h4>Day {index + 1}</h4>
                    <p>Date: {dayPlan.date}</p>
                    <p>Location: {dayPlan.location}</p>
                    <ul>
                      {dayPlan.activities.map((activity, idx) => (
                        <li key={idx}>{activity}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <button onClick={() => handleLike(itinerary._id, "itineraries")}>
                Like
              </button>
              <button
                onClick={() => handleUnlike(itinerary._id, "itineraries")}
              >
                Unlike
              </button>
              <button onClick={() => handleSave(itinerary._id, "itineraries")}>
                Save
              </button>
              <button
                onClick={() => handleUnsave(itinerary._id, "itineraries")}
              >
                Unsave
              </button>
              <div>
                <input
                  type="text"
                  placeholder="Add a comment"
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
              <div>
                {itinerary.comments.map((comment) => (
                  <div key={comment._id}>
                    <p>
                      {comment.user.username}: {comment.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
