import { useToast } from "@chakra-ui/react";
import React, { Fragment, useState } from "react";
import Loading from "../style/Loading";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import { ChatState } from "../../context/ChatProvider";

function Login() {
  const toast = useToast();
  const { setUser } = ChatState();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "please fill all the fields",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (password.length < 4) {
      toast({
        title: "password should be at least 4 character",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user/login",
        {
          email,
          password,
        },
        config
      );
      setLoading(false);
      localStorage.setItem("userInfo", JSON.stringify(data));
      console.log(data);
      setUser(data);
      navigate("/chats");
      toast({
        title: "user login successfully",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <form>
        <input
          type="email"
          placeholder="enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder=" password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="submit"
          value={`${loading ? "" : "Register"}`}
          disabled={loading}
          className="submit"
          onClick={submitHandler}
        ></input>
        {loading ? (
          <div className="spinning">
            <Loading />
          </div>
        ) : (
          ""
        )}
      </form>
    </Fragment>
  );
}

export default Login;
