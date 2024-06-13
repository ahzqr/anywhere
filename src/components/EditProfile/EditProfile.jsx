import { useState } from "react";
import { getUser } from "../../utilities/users-service";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const user = getUser();
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [bio, setBio] = useState(user.bio);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`/api/users/${user._id}/edit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          username,
          email,
          bio,
        }),
      });

      const data = await response.json();
      if (data.success) {
        navigate(`/profile/${user._id}`);
      } else {
        console.error("Failed to update profile", data.message);
      }
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Edit Profile</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto p-4 bg-white shadow-md rounded"
      >
        <label className="block mb-2">
          Name:
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="block w-full text-sm text-gray-700"
          />
        </label>
        <label className="block mb-2">
          Username:
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="block w-full text-sm text-gray-700"
          />
        </label>
        <label className="block mb-2">
          Email:
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="block w-full text-sm text-gray-700"
          />
        </label>
        <label className="block mb-2">
          Bio:
          <textarea
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            className="block w-full text-sm text-gray-700"
          />
        </label>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
