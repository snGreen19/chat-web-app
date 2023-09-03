import React, { Fragment, useEffect, useState } from "react";
import Login from "./Login";
import SignUp from "./SignUp";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();
  const [selectBody, setSelectBody] = useState(true);
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("userInfo"));
    if (data) {
      navigate("/chats");
    }
  }, [navigate]);
  return (
    <Fragment>
      <div className="homeContainer">
        <div className="welcomeBox">
          Chat App -
          <span>
            if you have an account so Login or Sign up to ba a authenticated
            user
          </span>
        </div>
        <div className="loginSignupBox">
          <div className="logSignHeading">
            <button
              onClick={() => setSelectBody(true)}
              className={`${selectBody ? "blue" : ""}`}
            >
              Login
            </button>
            <button
              onClick={() => setSelectBody(false)}
              className={`${selectBody ? "" : "blue"}`}
            >
              Signup
            </button>
          </div>
          {selectBody ? (
            <div className="loginBody">
              <Login />
            </div>
          ) : (
            <div className="SignUpBody">
              <SignUp />
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
}

export default HomePage;
