import React from "react";
import "./signin2.css";

const Signin = () => {
  return (
    <div>
      <a href="signup2.html" className="signup-link">
        Sign Up →
      </a>
      <div className="login-container">
        <h2>Log In</h2>
        <form>
          <label htmlFor="Username">Username</label>
          <input type="text" id="Username" placeholder="Enter your Username" required />

          <label htmlFor="email">Email</label>
          <input type="email" id="email" placeholder="Enter your email" required />

          <label htmlFor="password">Password</label>
          <input type="password" id="password" placeholder="Enter your password" required />

          <div className="options">
            <label className="remember-me">
              <input type="checkbox" /> Remember me
            </label>
            <a href="#" className="forgot-password">
              Forgot Password?
            </a>
          </div>
          <button type="submit" className="login-btn">
            Log In
          </button>
        </form>

        <div className="divider">Or sign up with:</div>

        <button className="google-btn">Sign in with Google</button>
      </div>
    </div>
  );
};

export default Signin;
