import debug from "debug";
import { useState } from "react";
import { Routes } from "react-router-dom";
import AuthPage from "../AuthPage/AuthPage";
import { getUser } from "../../utilities/users-service";
import NavBar from "../../components/NavBar/NavBar";

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
          <Routes></Routes>
        </main>
      </>
    );
  } else {
    return (
      <>
        <main className="App">
          <NavBar setUser={setUser} />
          <Routes></Routes>
        </main>
      </>
    );
  }
}
