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
    plan: [],
  });
  const user = getUser();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name.includes("travelDates")) {
      const [field, subField] = name.split('.');
      setFormData({
       ...formData,
        [field]: {
         ...formData[field],
          [subField]: value,
        },
      });
    } else {
      setFormData({
       ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
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
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log(data);
      navigate("/feed");
    } catch (error) {
      console.error("There was an error creating the post!", error);
    }
  };

  return (
    <div>
      <h2>Create a New Post</h2>
      <div>
        <label>
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

      <form onSubmit={handleSubmit}>
        {postType === "normalPost" ? (
          <div>
            <h3>Travel Post</h3>
            <label>
              Images:
              <input
                type="file"
                name="images"
                multiple
                onChange={handleChange}
              />
            </label>
            <label>
              Caption:
              <input
                type="text"
                name="caption"
                value={formData.caption}
                onChange={handleChange}
              />
            </label>
            <label>
              Location:
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </label>
            <label>
              Travel Dates:
              <label>
                Start Date:
                <input
                  type="date"
                  name="travelDates.start"
                  value={formData.travelDates.start}
                  onChange={handleChange}
                />
              </label>
              <label>
                End Date:
                <input
                  type="date"
                  name="travelDates.end"
                  value={formData.travelDates.end}
                  onChange={handleChange}
                />
              </label>
            </label>
            <label>
              Experience Type:
              <input
                type="text"
                name="experienceType"
                value={formData.experienceType}
                onChange={handleChange}
              />
            </label>
            <label>
              Tips:
              <textarea
                name="tips"
                value={formData.tips}
                onChange={handleChange}
              ></textarea>
            </label>
          </div>
        ) : (
          <div>
            <h3>Itinerary</h3>
            <label>
              Title:
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </label>
            <label>
              Description:
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </label>
            <label>
              Cover Photo:
              <input type="file" name="coverPhoto" onChange={handleChange} />
            </label>
            <label>
              Location:
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </label>
            <label>
              Travel Dates:
              <label>
                Start Date:
                <input
                  type="date"
                  name="travelDates.start"
                  value={formData.travelDates.start}
                  onChange={handleChange}
                />
              </label>
              <label>
                End Date:
                <input
                  type="date"
                  name="travelDates.end"
                  value={formData.travelDates.end}
                  onChange={handleChange}
                />
              </label>
            </label>
            <label>
              Plans:
              <textarea
                name="plan"
                value={formData.plan}
                onChange={handleChange}
              ></textarea>
            </label>
            <label>
              Experience Type:
              <input
                type="text"
                name="experienceType"
                value={formData.experienceType}
                onChange={handleChange}
              />
            </label>
          </div>
        )}
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
}
