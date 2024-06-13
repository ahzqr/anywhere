import debug from "debug";
import { Component } from "react";
import { signUp } from "../../utilities/users-service";

const log = debug("anywhere:components:SignUpForm");

export default class SignUpForm extends Component {
  state = {
    name: "",
    username: "",
    email: "",
    password: "",
    confirm: "",
    profilePic: null,
  };

  handleChange = (event) => {
    const { name, value } = event.target;

    this.setState({ ...this.state, [name]: value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const formData = { ...this.state };
    delete formData.error;
    delete formData.confirm;

    try {
      const user = await signUp(formData);
      log("user: %o", user);
      this.props.setUser(user);
    } catch (error) {
      this.setState({ error: "Sign Up Failed" });
    }
  };

  render() {
    const disable = this.state.password !== this.state.confirm;
    return (
      <div className="max-w-md mx-auto p-4 pt-6 pb-8 mb-4 bg-white rounded shadow-md">
        <form onSubmit={this.handleSubmit}>
          <label
            htmlFor="name"
            className="block mb-2"
          >
            Full Name
            <input
              id="name"
              type="text"
              name="name"
              value={this.state.name}
              onChange={this.handleChange}
              required
              className="w-full p-2 pl-10 text-sm text-gray-700"
            />
          </label>
          <label
            htmlFor="username"
            className="block mb-2"
          >
            Username
            <input
              id="username"
              type="text"
              name="username"
              value={this.state.username}
              onChange={this.handleChange}
              required
              className="w-full p-2 pl-10 text-sm text-gray-700"
            />
          </label>
          <label
            htmlFor="email"
            className="block mb-2"
          >
            Email
            <input
              id="email"
              type="email"
              name="email"
              value={this.state.email}
              onChange={this.handleChange}
              required
              className="w-full p-2 pl-10 text-sm text-gray-700"
            />
          </label>
          <label
            htmlFor="password"
            className="block mb-2"
          >
            Password
            <input
              id="password"
              type="password"
              name="password"
              minLength="3"
              value={this.state.password}
              onChange={this.handleChange}
              required
              className="w-full p-2 pl-10 text-sm text-gray-700"
            />
          </label>
          <label
            htmlFor="confirm-password"
            className="block mb-2"
          >
            Confirm Password
            <input
              id="confirm-password"
              type="password"
              name="confirm"
              value={this.state.confirm}
              onChange={this.handleChange}
              required
              className="w-full p-2 pl-10 text-sm text-gray-700"
            />
          </label>
          <button
            type="submit"
            disabled={disable}
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
          >
            SIGN UP
          </button>
        </form>
      </div>
    );
  }
}