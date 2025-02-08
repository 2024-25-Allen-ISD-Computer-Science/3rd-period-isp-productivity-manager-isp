import React from "react";
import "./signup2.css";

const Signup = () => {
  return (
    <div>
      <a href="signin2.html" className="login-link">
        Log In →
      </a>
      <div className="signup-container">
        <h2>Sign Up</h2>
        <form>
          <label htmlFor="name">Name</label>
          <input type="text" id="name" placeholder="Enter your name" required />

          <label htmlFor="email">Email</label>
          <input type="email" id="email" placeholder="Enter your email" required />

          <label htmlFor="password">Password</label>
          <input type="password" id="password" placeholder="Enter your password" required />

          <label htmlFor="confirm-password">Password Confirmation</label>
          <input type="password" id="confirm-password" placeholder="Confirm your password" required />

          <button type="submit" className="signup-btn">
            Sign up
          </button>
        </form>

        <div className="divider">Or sign up with:</div>

        <button className="google-btn">Sign up with Google</button>
      </div>
    </div>
  );
};

export default Signup;
