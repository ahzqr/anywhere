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
    <div className="flex flex-col h-screen p-4 bg-gray-100">
      <header className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <div className="flex items-center">
          <p className="mr-4">Total Users: {countData.userCount}</p>
          <p className="mr-4">Total Posts: {countData.postCount}</p>
          <p>Total Itineraries: {countData.itineraryCount}</p>
        </div>
      </header>

      <section className="flex flex-col mb-4">
        <h3 className="text-lg font-bold">Users</h3>
        <input
          type="search"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search User"
          className="w-full p-2 pl-10 text-sm text-gray-700"
        />
        <ul className="flex flex-col">
          {filteredUsers.slice(indexOfFirstUser, indexOfLastUser).map((user) => (
            <li key={user._id} className="flex justify-between mb-2">
              <div>
                <strong>{user.name}</strong>
                <br />
                <span className="text-gray-600">{user.username}</span>
                <br />
                <span className="text-gray-600">{user.email}</span>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
          <div className="flex justify-center mb-4">
            {Array(Math.ceil(users.length / usersPerPage))
             .fill()
             .map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded mx-2"
                >
                  {index + 1}
                </button>
              ))}
          </div>
        </ul>
      </section>

      <section className="flex flex-col mb-4">
        <h3 className="text-lg font-bold">Posts</h3>
        <input
          type="search"
          value={postSearchQuery}
          onChange={handlePostSearch}
          placeholder="Search by User / Location"
          className="w-full p-2 pl-10 text-sm text-gray-700"
        />
        <ul className="flex flex-col">
          {filteredPosts.slice(postIndexOfFirst, postIndexOfLast).map((post) => (
            <li key={post._id} className="flex justify-between mb-2">
              <div>
                <strong>{post.caption}</strong>
                <br />
                <span className="text-gray-600">{post.location}</span>
                <br />
                <span className="text-gray-600">
                  Likes: {post.likes.length} | Comments: {post.comments.length}
                </span>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => handleDeletePost(post._id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
          <div className="flex justify-center mb-4">
            {Array(Math.ceil(posts.length / postPerPage))
             .fill()
             .map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginatePosts(index + 1)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded mx-2"
                >
                  {index + 1}
                </button>
              ))}
          </div>
        </ul>
      </section>

      <section className="flex flex-col mb-4">
        <h3 className="text-lg font-bold">Itineraries</h3>
        <input
          type="search"
          value={itinerarySearchQuery}
          onChange={handleItinerarySearch}
          placeholder="Search by User / Location"
          className="w-full p-2 pl-10 text-sm text-gray-700"
        />
        <ul className="flex flex-col">
          {filteredItineraries
           .slice(itineraryIndexOfFirst, itineraryIndexOfLast)
           .map((itinerary) => (
              <li key={itinerary._id} className="flex justify-between mb-2">
                <div>
                  <strong>{itinerary.title}</strong>
                  <br />
                  <span className="text-gray-600">{itinerary.location}</span>
                  <br />
                  <span className="text-gray-600">
                    Likes: {itinerary.likes.length} | Comments: {itinerary.comments.length}
                  </span>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => handleDeleteItinerary(itinerary._id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          <div className="flex justify-center mb-4">
            {Array(Math.ceil(itineraries.length / itineraryPerPage))
             .fill()
             .map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginateItineraries(index + 1)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded mx-2"
                >
                  {index + 1}
                </button>
              ))}
          </div>
        </ul>
      </section>
    </div>
  );
}
