import LoginForm from "../../components/LoginForm/LoginForm";
import SignUpForm from "../../components/SignUpForm/SignUpForm";

export default function AuthPage({ setUser }) {
  return (
    <>
      <SignUpForm setUser={setUser} />
      <LoginForm setUser={setUser} />
    </>
  );
}
