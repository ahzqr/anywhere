import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/App/App.jsx";
// import '../styles.css';
import { BrowserRouter } from "react-router-dom";

localStorage.debug = "anywhere:*";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
