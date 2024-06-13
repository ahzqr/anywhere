import { useState } from 'react';
import LoginForm from "../../components/LoginForm/LoginForm";
import SignUpForm from "../../components/SignUpForm/SignUpForm";

export default function AuthPage({ setUser }) {
  const [showLogin, setShowLogin] = useState(true);

  const handleToggle = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div className="flex flex-col justify-center h-screen">
      <div className="max-w-md mx-auto p-4 pt-6 pb-8 mb-4 bg-white rounded shadow-md">
        {showLogin ? (
          <LoginForm setUser={setUser} />
        ) : (
          <SignUpForm setUser={setUser} />
        )}
      </div>
      <p className="text-center">
        {showLogin ? (
          <a href="#" onClick={handleToggle}>
            New user? Sign up
          </a>
        ) : (
          <a href="#" onClick={handleToggle}>
            Already have an account? Login
          </a>
        )}
      </p>
    </div>
  );
}