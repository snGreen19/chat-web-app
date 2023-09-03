import { ArrowBackIcon } from "@chakra-ui/icons";
import { Skeleton, Stack, useDisclosure, useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { ChatState } from "../../../context/ChatProvider";
import EditGroup from "../group/EditGroup";
import "./ChatBox.css";
import ImageViewModal from "./ImageViewModal";
import Messages from "./Messages";
import Loading from "../../style/Loading";
import notificationSound from "../../../sound/notification.mp3";

import io from "socket.io-client";

const ENDPOINT = "https://chat-random-web.onrender.com";
var socket;

function ChatBox() {
  const toast = useToast();
  const { setSelectChat, selectChat, user, setMessageLoading, messageLoading } =
    ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newMessage, setNewMessage] = useState("");
  const [allMessages, setAllMessages] = useState("");
  const [inputLoading, setInputLoading] = useState(false);
  const audioRef = useRef(null);

  // const [socketConnected, setSocketConnected] = useState(false);
  const removeSelectHandler = () => {
    setSelectChat("");
  };
  // update message state
  const getMessageHandler = (e) => {
    setNewMessage(e.target.value);
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    socket.emit("setUp", userInfo);
    socket.on("connected", () => {
      console.log("some data are come from backend");
      // setSocketConnected(true);
    });
  }, []);

  useEffect(() => {
    if (selectChat) {
      socket.emit("joinChat", selectChat._id);
    }
  }, [selectChat]);

  useEffect(() => {
    fetchAllMessage();
    // selectedChatCompare = selectChat;
    // eslint-disable-next-line
  }, [selectChat]);

  useEffect(() => {
    socket.on("newGet", (newget) => {
      console.log("getdata", newget);
      setAllMessages((prevMessages) => [...prevMessages, newget]);
      audioRef.current.play();
    });
  }, []);

  console.log(allMessages);

  /// fetch all chats
  const fetchAllMessage = async () => {
    if (selectChat && user) {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };
        const { data } = await axios.get(
          `/api/message/all/${selectChat._id}`,
          config
        );
        setAllMessages(data);
        setMessageLoading(false);
        // socket.emit("joinChat", selectChat._id);
      } catch (error) {
        setMessageLoading(false);

        console.log(error);
        toast({
          title: "Some Error Occurs",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      }
    }
  };

  //.............................................new chat
  const submitTextHandler = async (e) => {
    e.preventDefault();
    if ((e.key = "Enter" && newMessage)) {
      setNewMessage("");
      try {
        setInputLoading(true);
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };
        const { data } = await axios.post(
          `/api/message/new`,
          {
            chatId: selectChat._id,
            content: newMessage,
          },
          config
        );

        setAllMessages((prevMessages) => [...prevMessages, data]);
        // audioRef.current.play();

        socket.emit("new", data);
        setInputLoading(false);
      } catch (error) {
        setInputLoading(false);
        console.log(error);
        toast({
          title: "Some Error Occurs",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      }
    }
  };

  // to make notifi sound .........................................

  // to make notifi sound .........................................

  return (
    <Fragment>
      {selectChat ? (
        <Fragment>
          <div className="allChatingBox">
            <div className="selcetUserInfo">
              <button className="backArrawBtn" onClick={removeSelectHandler}>
                <ArrowBackIcon />
              </button>
              <div className="selectImg">
                {selectChat.isGroupChat === false ? (
                  <img
                    src={
                      user && selectChat.users[1]._id === user.id
                        ? selectChat.users[0].image
                        : selectChat.users[1].image
                    }
                    alt="selectusers"
                    onClick={onOpen}
                  />
                ) : (
                  <img
                    src="https://res.cloudinary.com/dpynprxka/image/upload/v1693237853/avaters/grouplogo3_ajivua.jpg"
                    alt="selectGroup"
                  />
                )}
              </div>
              <span>
                {selectChat.isGroupChat
                  ? selectChat.chatName
                  : user && selectChat.users[1]._id === user.id
                  ? selectChat.users[0].name
                  : selectChat.users[1].name}
                {selectChat.isGroupChat ? <EditGroup /> : ""}
              </span>
              {!selectChat.isGroupChat && (
                <span className="online">(online)</span>
              )}
            </div>
            <div className="allMessagesBox">
              {messageLoading ? (
                <Stack height={"195%"} width={"210%"}>
                  <Skeleton height={"50%"} />
                </Stack>
              ) : (
                <Messages allMessages={allMessages} />
              )}
              <form onSubmit={submitTextHandler}>
                <input
                  type="text"
                  placeholder="Type a message"
                  value={newMessage}
                  onChange={getMessageHandler}
                />
              </form>
              <div className="inputLoading">
                {inputLoading ? <Loading /> : ""}
              </div>
            </div>
          </div>
          <ImageViewModal isOpen={isOpen} onClose={onClose} />
        </Fragment>
      ) : (
        <div className="allChatingBox"></div>
      )}
      <Fragment>
        <div>
          <audio ref={audioRef} controls={false}>
            <source src={notificationSound} type="audio/mpeg" />
          </audio>
        </div>
      </Fragment>
    </Fragment>
  );
}

export default ChatBox;
