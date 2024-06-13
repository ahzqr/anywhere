import { useEffect, useState } from "react";
import { getUser } from "../../utilities/users-service";
import { Link } from "react-router-dom";

export default function SavedContent() {
  const [savedPosts, setSavedPosts] = useState([]);
  const [savedItineraries, setSavedItineraries] = useState([]);
  const currentUser = getUser();

  useEffect(() => {
    const fetchSavedContent = async () => {
      try {
        const response = await fetch(`/api/users/${currentUser._id}/saved`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setSavedPosts(data.savedPosts);
        setSavedItineraries(data.savedItineraries);
      } catch (error) {
        console.error("Failed to fetch saved content", error);
      }
    };

    fetchSavedContent();
  }, [currentUser._id]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Saved Posts</h2>
      <ul className="list-none mb-8">
        {savedPosts.map((post) => (
          <li key={post._id} className="mb-4">
            <h3 className="text-lg font-bold">{post.caption}</h3>
            <p className="text-gray-600">{post.content}</p>
            <Link
              to={`/post/${post._id}`}
              className="text-blue-600 hover:text-blue-800"
            >
              View Post
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-bold mb-4">Saved Itineraries</h2>
      <ul className="list-none mb-8">
        {savedItineraries.map((itinerary) => (
          <li key={itinerary._id} className="mb-4">
            <h3 className="text-lg font-bold">{itinerary.title}</h3>
            <p className="text-gray-600">{itinerary.description}</p>
            <Link
              to={`/itinerary/${itinerary._id}`}
              className="text-blue-600 hover:text-blue-800"
            >
              View Itinerary
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
