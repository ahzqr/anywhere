import { useState } from "react";
import { getUser } from "../../utilities/users-service";
import { useNavigate } from "react-router-dom";

export default function AddPost() {
  const [postType, setPostType] = useState("normalPost");
  const [formData, setFormData] = useState({
    images: [],
    caption: "",
    location: "",
    travelDates: {
      start: "",
      end: "",
    },
    experienceType: "",
    tips: "",
    title: "",
    description: "",
    coverPhoto: "",
    plans: "",
  });
  const user = getUser();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name.includes("travelDates")) {
      const [field, subField] = name.split(".");
      setFormData({
        ...formData,
        [field]: {
          ...formData[field],
          [subField]: value,
        },
      });
    } else if (name === "images" || name === "coverPhoto") {
      setFormData({
        ...formData,
        [name]: files,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const uploadImage = async (image) => {
    const formData = new FormData();
    formData.append("file", image);
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    return data.url;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let imageUrls = [];
    if (formData.images.length > 0) {
      for (let i = 0; i < formData.images.length; i++) {
        const imageUrl = await uploadImage(formData.images[i]);
        imageUrls.push(imageUrl);
      }
    }
    let coverPhotoUrl = "";
    if (formData.coverPhoto.length > 0) {
      coverPhotoUrl = await uploadImage(formData.coverPhoto[0]);
    }

    const postData = {
      ...formData,
      images: imageUrls,
      coverPhoto: coverPhotoUrl,
    };

    const url =
      postType === "normalPost"
        ? `/api/content/posts/${user._id}`
        : `/api/content/itineraries/${user._id}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();
      console.log(data);
      navigate("/feed");
    } catch (error) {
      console.error("There was an error creating the post!", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Create a New Post</h2>
      <div className="flex justify-center mb-4">
        <label className="mr-4">
          <input
            type="radio"
            value="normalPost"
            checked={postType === "normalPost"}
            onChange={() => setPostType("normalPost")}
          />
          Travel Post
        </label>
        <label>
          <input
            type="radio"
            value="itinerary"
            checked={postType === "itinerary"}
            onChange={() => setPostType("itinerary")}
          />
          Itinerary
        </label>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white shadow-md rounded">
        {postType === "normalPost"? (
          <div>
            <h3 className="text-lg font-bold mb-2">Travel Post</h3>
            <label className="block mb-2">
              Images:
              <input
                type="file"
                name="images"
                multiple
                onChange={handleChange}
                className="block w-full text-sm text-gray-700"
              />
            </label>
            <label className="block mb-2">
              Caption:
              <input
                type="text"
                name="caption"
                value={formData.caption}
                onChange={handleChange}
                className="block w-full text-sm text-gray-700"
              />
            </label>
            <label className="block mb-2">
              Location:
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="block w-full text-sm text-gray-700"
              />
            </label>
            <label className="block mb-2">
              Travel Dates:
              <label className="block mb-1">
                Start Date:
                <input
                  type="date"
                  name="travelDates.start"
                  value={formData.travelDates.start}
                  onChange={handleChange}
                  className="block w-full text-sm text-gray-700"
                />
              </label>
              <label className="block mb-1">
                End Date:
                <input
                  type="date"
                  name="travelDates.end"
                  value={formData.travelDates.end}
                  onChange={handleChange}
                  className="block w-full text-sm text-gray-700"
                />
              </label>
            </label>
            <label className="block mb-2">
              Experience Type:
              <input
                type="text"
                name="experienceType"
                value={formData.experienceType}
                onChange={handleChange}
                className="block w-full text-sm text-gray-700"
              />
            </label>
            <label className="block mb-2">
              Tips:
              <textarea
                name="tips"
                value={formData.tips}
                onChange={handleChange}
                className="block w-full text-sm text-gray-700"
              ></textarea>
            </label>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-bold mb-2">Itinerary</h3>
            <label className="block mb-2">
              Title:
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="block w-full text-sm text-gray-700"
              />
            </label>
            <label className="block mb-2">
              Description:
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="block w-full text-sm text-gray-700"
              ></textarea>
            </label>
            <label className="block mb-2">
              Cover Photo:
              <input type="file" name="coverPhoto" onChange={handleChange} className="block w-full text-sm text-gray-700" />
            </label>
            <label className="block mb-2">
              Location:
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="block w-full text-sm text-gray-700"
              />
            </label>
            <label className="block mb-2">
              Travel Dates:
              <label className="block mb-1">
                Start Date:
                <input
                  type="date"
                  name="travelDates.start"
                  value={formData.travelDates.start}
                  onChange={handleChange}
                  className="block w-full text-sm text-gray-700"
                />
              </label>
              <label className="block mb-1">
                End Date:
                <input
                  type="date"
                  name="travelDates.end"
                  value={formData.travelDates.end}
                  onChange={handleChange}
                  className="block w-full text-sm text-gray-700"
                />
              </label>
            </label>
            <label className="block mb-2">
              Plans:
              <textarea
                name="plan"
                value={formData.plan}
                onChange={handleChange}
                className="block w-full text-sm text-gray-700"
              ></textarea>
            </label>
            <label className="block mb-2">
              Experience Type:
              <input
                type="text"
                name="experienceType"
                value={formData.experienceType}
                onChange={handleChange}
                className="block w-full text-sm text-gray-700"
              />
            </label>
          </div>
        )}
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Create Post
        </button>
      </form>
    </div>
  );
}
