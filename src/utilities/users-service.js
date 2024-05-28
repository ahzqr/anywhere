import debug from "debug";
import * as usersAPI from "./users-api";

const log = debug("anywhere:utilities:users-service");

export function getToken() {
  // getItem returns null if there's no string
  const token = localStorage.getItem("token");
  if (!token) return null;
  // Obtain the payload of the token
  const payload = JSON.parse(atob(token.split(".")[1]));
  // A JWT's exp is expressed in seconds, not milliseconds, so convert
  if (payload.exp < Date.now() / 1000) {
    // Token has expired - remove it from localStorage
    localStorage.removeItem("token");
    return null;
  }
  return token;
}

export function getUser() {
  const token = getToken();
  // If there's a token, return the user in the payload, otherwise return null
  return token ? JSON.parse(atob(token.split(".")[1])).user : null;
}

export const signUp = async (userData) => {
  log("userData: %o", userData);

  const token = await usersAPI.signUp(userData);
  log("token: %o", token);

  localStorage.setItem("token", token);
  return getUser();
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const login = async (username, password) => {
  log("%s, %s", username, password);
  const user = { username, password };

  const token = await usersAPI.login(user);
  log("token: %o", token);

  localStorage.setItem("token", token);
  return getUser();
};

export const checkToken = async () => {
  const dateStr = await usersAPI.checkToken();
  return new Date(dateStr);
};
