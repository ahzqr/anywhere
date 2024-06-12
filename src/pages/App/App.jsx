import debug from "debug";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import AuthPage from "../AuthPage/AuthPage";
import { getUser } from "../../utilities/users-service";
import NavBar from "../../components/NavBar/NavBar";
import AddPost from "../../components/AddPost/AddPost";
import FeedPage from "../FeedPage/FeedPage";
import ProfilePage from "../ProfilePage/ProfilePage";
import AdminDashboard from "../AdminDashboard/AdminDashboard";
import SavedContent from "../../components/SavedContent/SavedContent";
import SearchResults from "../../components/SearchResults/SearchResults";
import ViewContent from "../../components/ViewContent/ViewContent";

const log = debug("mern:pages:App:App");

export default function App() {
  // eslint-disable-next-line no-unused-vars
  const [user, setUser] = useState(getUser()); // getUser()
  log("user %o", user);

  if (!user) {
    return (
      <>
        <main className="App">
          <AuthPage setUser={setUser} />
        </main>
      </>
    );
  } else if (user && user.isAdmin === true) {
    return (
      <>
        <main className="App">
          <NavBar setUser={setUser} />
          <Routes>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/saved" element={<SavedContent />} />
            <Route path="/post" element={<AddPost />} />
            <Route path="/feed" element={<FeedPage user={user} />} />
            <Route
              path="/profile/:userId"
              element={<ProfilePage user={user} />}
            />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/:type/:id" element={<ViewContent user={user} />} />
          </Routes>
        </main>
      </>
    );
  } else {
    return (
      <>
        <main className="App">
          <NavBar setUser={setUser} />
          <Routes>
            <Route path="/post" element={<AddPost />} />
            <Route path="/feed" element={<FeedPage user={user} />} />
            <Route
              path="/profile/:userId"
              element={<ProfilePage user={user} />}
            />
            <Route path="/saved" element={<SavedContent />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/:type/:id" element={<ViewContent user={user} />} />
          </Routes>
        </main>
      </>
    );
  }
}
