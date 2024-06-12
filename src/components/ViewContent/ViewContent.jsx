import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function ViewContent({ user }) {
  const [post, setPost] = useState({});
  const [itinerary, setItinerary] = useState(null);
  const { type, id } = useParams();
  // eslint-disable-next-line no-unused-vars
  const [likes, setLikes] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/content/${type}/${id}`);
        const data = await response.json();
        type === "post" ? setPost(data) : setItinerary(data);
      } catch (error) {
        console.error("Failed to fetch feed", error);
      }
    };
    fetchData();
  }, [id, type]);

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

  const handleDeleteContent = async (id, type) => {
    try {
      await fetch(`/api/content/${type}/${id}/${user._id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Failed to ddelete", error);
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
          <button onClick={() => handleUnlike(id, type)}>Unlike</button>
        ) : (
          <button onClick={() => handleLike(id, type)}>Like</button>
        )}
      </div>
    );
  };

  return (
    <div>
      <div>
        {type === "post" ? (
          <div key={post?._id}>
            <h5>
              <Link to={`/profile/${post?.user?._id}`}>
                <img
                  src={post?.user?.profilepic}
                  style={{ width: "32px", height: "32px" }}
                />
                <strong>{post?.user?.username}</strong>
              </Link>
            </h5>
            <p>{post?.location}</p>
            {post?.images?.map((image, index) => (
              <img key={index} src={image} alt={`Image ${index}`} />
            ))}
            <p>
              {new Date(post?.travelDates?.start).toLocaleDateString()} -{" "}
              {new Date(post?.travelDates?.end).toLocaleDateString()}
            </p>
            <p>{post?.caption}</p>
            <p>{post?.experienceType}</p>
            <p>{post?.tips}</p>
            <FetchLikes id={id} type="posts" user={user} />
            <p>Likes: {post?.likes?.length}</p>
            <button onClick={() => handleSave(post?._id, "posts")}>Save</button>
            <button onClick={() => handleUnsave(post?._id, "posts")}>
              Unsave
            </button>
            {user._id === post?.user?._id ? (
               <button onClick={() => handleDeleteContent(post?._id, "posts")}>
               Delete
             </button>
            ) : (
              ""
            )}
           
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

            {post?.comments?.map((comment) => (
              <div key={comment._id}>
                <p>
                  <Link to={`/profile/${comment.user._id}`}>
                    <strong>{comment.user.username}</strong>
                  </Link>{" "}
                  : {comment.content}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div key={itinerary?._id}>
            <h5>
              <Link to={`/profile/${itinerary?.user?._id}`}>
                <img
                  src={itinerary?.user?.profilepic}
                  style={{ width: "32px", height: "32px" }}
                />
                <strong>{itinerary?.user?.username}</strong>
              </Link>
            </h5>
            <p>{itinerary?.title}</p>
            <p>{itinerary?.location}</p>
            <img src={itinerary?.coverPhoto} alt={itinerary?.title} />
            <p>
              {new Date(itinerary?.travelDates?.start).toLocaleDateString()} -{" "}
              {new Date(itinerary?.travelDates?.end).toLocaleDateString()}
            </p>
            <p>{itinerary?.description}</p>
            <p>{itinerary?.experienceType}</p>
            <div>
              {itinerary?.plan?.map((dayPlan, index) => (
                <div key={index}>
                  <h4>Day {index + 1}</h4>
                  <p>Date: {new Date(dayPlan.date).toLocaleDateString()}</p>
                  <p>Location: {dayPlan.location}</p>
                  <ul>
                    {/* {dayPlan?.activities?.map((activity, idx) => (
                        <li key={idx}>{activity}</li>
                      ))} */}
                  </ul>
                </div>
              ))}
            </div>
            <FetchLikes id={id} type="itineraries" user={user} />
            <p>Likes: {itinerary?.likes?.length}</p>
            <button onClick={() => handleSave(itinerary?._id, "itineraries")}>
              Save
            </button>
            <button onClick={() => handleUnsave(itinerary?._id, "itineraries")}>
              Unsave
            </button>
            {user._id === itinerary?.user?._id ? (
              <button
                onClick={() =>
                  handleDeleteContent(itinerary?._id, "itineraries")
                }
              >
                Delete
              </button>
            ) : (
              ""
            )}
            <div>
              <input
                type="text"
                placeholder="Add a comment"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddComment(
                      itinerary?._id,
                      "itineraries",
                      e.target.value
                    );
                    e.target.value = "";
                  }
                }}
              />
            </div>
            <div>
              {itinerary?.comments?.map((comment) => (
                <div key={comment._id}>
                  <p>
                    <Link to={`/profile/${comment?.user?._id}`}>
                      <strong>{comment?.user?.username}</strong>
                    </Link>{" "}
                    : {comment?.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}