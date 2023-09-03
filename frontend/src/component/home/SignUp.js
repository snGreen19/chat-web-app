import React, { Fragment, useState } from "react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import "./HomePage.css";
import Loading from "../style/Loading";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../context/ChatProvider";

function SignUp() {
  const toast = useToast();
  const navigate = useNavigate();
  const { setUser } = ChatState();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpass, setConfirmPass] = useState("");
  const [localImage, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const formSubmitHandler = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmpass) {
      toast({
        title: "please fill all the fields",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (localImage === null || localImage === undefined) {
      toast({
        title: "please select a profile image",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (password.length < 4 || confirmpass.length < 4) {
      toast({
        title: "password should be at least 4 character",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (password !== confirmpass) {
      toast({
        title: "password doesent match",
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
        "/api/user/register/new",
        {
          name,
          email,
          password,
          localImage,
        },
        config
      );
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      setUser(data);
      navigate("/chats");
      toast({
        title: "user registered successfully",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: error.response.data.err,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  const registeredDataChange = async (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setImage(reader.result);
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <Fragment>
      <form onSubmit={formSubmitHandler}>
        <input
          type="text"
          placeholder="enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
          type="text"
          placeholder="confirm password"
          value={confirmpass}
          onChange={(e) => setConfirmPass(e.target.value)}
        />
        <input
          type="file"
          p={1.5}
          accept="image/*"
          placeholder="images"
          className={` custom-file-input ${localImage !== null ? "add" : ""}`}
          name="avater"
          onChange={registeredDataChange}
        />
        <input
          type="submit"
          value={`${loading ? "" : "Register"}`}
          className="submit"
          disabled={loading}
        ></input>
        {loading ? (
          <div className="spinning">
            <Loading />
          </div>
        ) : (
          ""
        )}

        {localImage && (
          <div className="imagesPreview">
            <img src={localImage} alt="preview"></img>
          </div>
        )}
      </form>
    </Fragment>
  );
}

export default SignUp;
