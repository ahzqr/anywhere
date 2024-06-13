import debug from "debug";
import { login } from "../../utilities/users-service";
import { useNavigate } from "react-router-dom";

const log = debug("anywhere:components:LoginForm");
export default function LoginForm({ setUser }) {
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    log("data: %o", data);
    const { username, password } = data;
    const user = await login(username, password);
    setUser(user);
    user.isAdmin ? navigate("/admin") : navigate("/feed");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 pt-6 pb-8 mb-4 bg-white rounded shadow-md">
      <fieldset className="mb-4">
        <legend className="text-lg font-bold mb-2">Login</legend>
        <label className="block mb-2">
          Username:
          <input
            name="username"
            className="w-full p-2 pl-10 text-sm text-gray-700"
            placeholder="Username"
          />
        </label>
        <label className="block mb-2">
          Password:
          <input
            name="password"
            type="password"
            className="w-full p-2 pl-10 text-sm text-gray-700"
            placeholder="Password"
          />
        </label>
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
        >
          Login
        </button>
      </fieldset>
    </form>
  );
}