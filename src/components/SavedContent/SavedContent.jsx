import { useEffect, useState } from "react";
import { getUser } from "../../utilities/users-service";

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
    <div>
      <h2>Saved Posts</h2>
      <ul>
        {savedPosts.map((post) => (
          <li key={post._id}>
            <h3>{post.caption}</h3>
            <p>{post.content}</p>
          </li>
        ))}
      </ul>

      <h2>Saved Itineraries</h2>
      <ul>
        {savedItineraries.map((itinerary) => (
          <li key={itinerary._id}>
            <h3>{itinerary.title}</h3>
            <p>{itinerary.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
