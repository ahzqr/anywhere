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
    navigate("/orders");
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset>
        <legend>Login</legend>
        <label>
          Username:
          <input name="username" />
        </label>
        <br />

        <label>
          Password:
          <input name="password" />
        </label>
        <br />
        <button>Login</button>
      </fieldset>
    </form>
  );
}
