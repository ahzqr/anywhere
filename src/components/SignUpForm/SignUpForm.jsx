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
      <div>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={this.state.name}
            onChange={this.handleChange}
            required
          />
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            name="username"
            value={this.state.username}
            onChange={this.handleChange}
            required
          />
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={this.state.email}
            onChange={this.handleChange}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            minLength="3"
            value={this.state.password}
            onChange={this.handleChange}
            required
          />
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            id="confirm-password"
            type="password"
            name="confirm"
            value={this.state.confirm}
            onChange={this.handleChange}
            required
          />
          <button type="submit" disabled={disable}>
            SIGN UP
          </button>
        </form>
      </div>
    );
  }
}
