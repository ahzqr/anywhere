import { useEffect, useState } from "react";
import sendRequest from "../../utilities/send-request";

export default function AdminDashboard() {
  const [countData, setCountData] = useState({
    userCount: 0,
    postCount: 0,
    itineraryCount: 0,
  });
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [postSearchQuery, setPostSearchQuery] = useState("");
  const [itinerarySearchQuery, setItinerarySearchQuery] = useState("");
  const [postCurrentPage, setPostCurrentPage] = useState(1);
  const [itineraryCurrentPage, setItineraryCurrentPage] = useState(1);

  const usersPerPage = 6;
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  const postPerPage = 6;
  const postIndexOfLast = postCurrentPage * postPerPage;
  const postIndexOfFirst = postIndexOfLast - postPerPage;

  const itineraryPerPage = 6;
  const itineraryIndexOfLast = itineraryCurrentPage * itineraryPerPage;
  const itineraryIndexOfFirst = itineraryIndexOfLast - itineraryPerPage;

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const paginatePosts = (pageNumber) => {
    setPostCurrentPage(pageNumber);
  };

  const paginateItineraries = (pageNumber) => {
    setItineraryCurrentPage(pageNumber);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handlePostSearch = (event) => {
    setPostSearchQuery(event.target.value);
  };

  const handleItinerarySearch = (event) => {
    setItinerarySearchQuery(event.target.value);
  };

  const filteredUsers = users.filter((user) => {
    const name = user.name.toLowerCase();
    const username = user.username.toLowerCase();
    const email = user.email.toLowerCase();
    const search = searchQuery.toLowerCase();

    return (
      name.includes(search) ||
      username.includes(search) ||
      email.includes(search)
    );
  });

  const filteredPosts = posts.filter((post) => {
    const user = post.user.username.toLowerCase();
    const location = post.location.toLowerCase();
    const search = postSearchQuery.toLowerCase();

    return user.includes(search) || location.includes(search);
  });

  const filteredItineraries = itineraries.filter((itinerary) => {
    const user = itinerary.user.username.toLowerCase();
    const location = itinerary.location.toLowerCase();
    const search = itinerarySearchQuery.toLowerCase();

    return user.includes(search) || location.includes(search);
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await sendRequest("/api/admin/data", "GET");
        setCountData(data);
      } catch (error) {
        console.error("Failed to fetch count data", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const data = await sendRequest("/api/admin/users", "GET");
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };

    const fetchPosts = async () => {
      try {
        const data = await sendRequest("/api/admin/posts", "GET");
        setPosts(data);
      } catch (error) {
        console.error("Failed to fetch posts", error);
      }
    };

    const fetchItineraries = async () => {
      try {
        const data = await sendRequest("/api/admin/itineraries", "GET");
        setItineraries(data);
      } catch (error) {
        console.error("Failed to fetch itineraries", error);
      }
    };

    fetchDashboardData();
    fetchUsers();
    fetchPosts();
    fetchItineraries();
  }, []);

  const handleDeleteUser = async (id) => {
    try {
      await sendRequest(`/api/admin/users/${id}`, "DELETE");

      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  };

  const handleDeletePost = async (id) => {
    try {
      await sendRequest(`/api/admin/posts/${id}`, "DELETE");
      setPosts(posts.filter((post) => post._id !== id));
    } catch (error) {
      console.error("Failed to delete post", error);
    }
  };

  const handleDeleteItinerary = async (id) => {
    try {
      await sendRequest(`/api/admin/itineraries/${id}`, "DELETE");
      setItineraries(itineraries.filter((itinerary) => itinerary._id !== id));
    } catch (error) {
      console.error("Failed to delete itinerary", error);
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Total Users: {countData.userCount}</p>
      <p>Total Posts: {countData.postCount}</p>
      <p>Total Itineraries: {countData.itineraryCount}</p>
      <h3>Users</h3>
      <input
        type="search"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search User"
      />
      <ul>
        {filteredUsers.slice(indexOfFirstUser, indexOfLastUser).map((user) => (
          <li key={user._id}>
            Name: <strong>{user.name}</strong> <br />
            Account Username: <strong>{user.username}</strong>
            <br />
            Email: <strong>{user.email}</strong> <br />
            Account Created:{" "}
            <strong>{new Date(user.createdAt).toLocaleDateString()} </strong>
            <br />
            Following: <strong>{user.following.length}</strong> <br />
            Followers: <strong>{user.followers.length}</strong> <br />
            <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
          </li>
        ))}
        <div>
          {Array(Math.ceil(users.length / usersPerPage))
            .fill()
            .map((_, index) => (
              <button key={index} onClick={() => paginate(index + 1)}>
                {index + 1}
              </button>
            ))}
        </div>
      </ul>
      <h3>Posts</h3>
      <input
        type="search"
        value={postSearchQuery}
        onChange={handlePostSearch}
        placeholder="Search by User / Location"
      />
      <ul>
        {filteredPosts.slice(postIndexOfFirst, postIndexOfLast).map((post) => (
          <li key={post._id}>
            <strong>{post.caption}</strong> <br />
            Location: <strong>{post.location}</strong> <br />
            Likes: <strong>{post.likes.length} </strong>
            <br />
            Comments: <strong>{post.comments.length}</strong> <br />
            Posted by: <strong>{post.user.username}</strong> <br />
            Posted on:{" "}
            <strong>
              {new Date(post.createdAt).toLocaleDateString()}{" "}
            </strong>{" "}
            <br />
            <button onClick={() => handleDeletePost(post._id)}>Delete</button>
          </li>
        ))}
        <div>
          {Array(Math.ceil(posts.length / postPerPage))
            .fill()
            .map((_, index) => (
              <button key={index} onClick={() => paginatePosts(index + 1)}>
                {index + 1}
              </button>
            ))}
        </div>
      </ul>
      <h3>Itineraries</h3>
      <input
        type="search"
        value={itinerarySearchQuery}
        onChange={handleItinerarySearch}
        placeholder="Search by User / Location"
      />
      <ul>
        {filteredItineraries
          .slice(itineraryIndexOfFirst, itineraryIndexOfLast)
          .map((itinerary) => (
            <li key={itinerary._id}>
              <strong>{itinerary.title}</strong> <br />
              Location: <strong>{itinerary.location}</strong> <br />
              Likes: <strong>{itinerary.likes.length} </strong>
              <br />
              Comments: <strong>{itinerary.comments.length}</strong> <br />
              Posted by: <strong>{itinerary.user.username}</strong> <br />
              Posted on:{" "}
              <strong>
                {new Date(itinerary.createdAt).toLocaleDateString()}{" "}
              </strong>{" "}
              <br />
              <button onClick={() => handleDeleteItinerary(itinerary._id)}>
                Delete
              </button>
            </li>
          ))}
        <div>
          {Array(Math.ceil(itineraries.length / itineraryPerPage))
            .fill()
            .map((_, index) => (
              <button
                key={index}
                onClick={() => paginateItineraries(index + 1)}
              >
                {index + 1}
              </button>
            ))}
        </div>
      </ul>
    </div>
  );
}
