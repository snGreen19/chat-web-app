import React, { useEffect } from "react";
import "./ChatPage.css";
import Heading from "./style/Heading";
import { useNavigate } from "react-router-dom";
import MyChats from "./style/myChats/MyChats";
import ChatBox from "./style/ChatBox/ChatBox";
import { ChatState } from "../context/ChatProvider";

function ChatPage() {
  const navigate = useNavigate();
  const { selectChat } = ChatState();
  useEffect(() => {
    if (!localStorage.getItem("userInfo")) {
      navigate("/");
    }
  }, [navigate]);
  return (
    <div className="chatPageContainer">
      <div className="headline">
        <Heading />
      </div>
      <div className="allBoxes">
        <div className={`leftBox ${selectChat ? "vanish" : ""}`}>
          <MyChats />
        </div>
        <div className={`rightBox ${selectChat ? "" : "disapear"}`}>
          <ChatBox />
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
