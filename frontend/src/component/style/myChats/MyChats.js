import { TimeIcon } from "@chakra-ui/icons";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import { ChatState } from "../../../context/ChatProvider";
import Loading from "../../style/loading/ForLoading";

import "./MyChats.css";
function MyChats() {
  const toast = useToast();
  const { user, selectChat, setSelectChat, setMessageLoading } = ChatState();
  const [myChatHistory, setMyChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchAllChats = async () => {
    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get(`/api/chats/allchat`, config);
      setMyChatHistory(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast({
        title: "some error occers",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };
  const selectChatHandler = (select) => {
    setSelectChat(select);
    setMessageLoading(true);
  };
  useEffect(() => {
    if (user) {
      fetchAllChats();
    }
    // eslint-disable-next-line
  }, [user, selectChat]);
  return (
    <Fragment>
      <div className="allChatBox">
        <div className="chatHistory">
          Chat History <TimeIcon />
        </div>
        {loading ? (
          <div className="loadingForUsers">
            <Loading />
          </div>
        ) : (
          <div className="myChats">
            {myChatHistory &&
              myChatHistory.map((chats) =>
                chats.isGroupChat === false ? (
                  <div
                    className="myChatItemBox"
                    key={chats._id}
                    onClick={() => selectChatHandler(chats)}
                    style={
                      selectChat && selectChat._id === chats._id
                        ? {
                            border: "1px solid #ffc470",
                            backgroundColor: "rgb(241, 241, 241)",
                          }
                        : {}
                    }
                  >
                    <div className="image">
                      <img
                        src={
                          user && chats.users[0]._id === user.id
                            ? chats.users[1].image
                            : chats.users[0].image
                        }
                        alt="userImage"
                      />
                    </div>
                    <div className="chatInfo">
                      <h2>
                        {user && chats.users[0]._id === user.id
                          ? chats.users[1].name
                          : chats.users[0].name}
                      </h2>
                      <p>
                        <span></span> Let's chat togather
                      </p>
                    </div>
                  </div>
                ) : (
                  <div
                    className="myChatItemBox"
                    key={chats._id}
                    onClick={(e) => selectChatHandler(chats)}
                  >
                    <div className="image">
                      <img
                        src="https://res.cloudinary.com/dpynprxka/image/upload/v1693237853/avaters/grouplogo3_ajivua.jpg"
                        alt="groupImage"
                      />
                    </div>
                    <div className="chatInfo">
                      <h2>{chats.chatName}</h2>
                      <p>
                        <span></span> Let's join us
                      </p>
                    </div>
                  </div>
                )
              )}
          </div>
        )}
      </div>
    </Fragment>
  );
}

export default MyChats;
