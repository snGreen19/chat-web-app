import React, { Fragment, useEffect, useRef } from "react";
import { ChatState } from "../../../context/ChatProvider";
import GroupImageSetup from "./GroupImageSetup";
import "./Messages.css";

function Messages({ allMessages }) {
  const { user, selectChat } = ChatState();
  const messageDiv = useRef(null);
  useEffect(() => {
    if (messageDiv.current) {
      messageDiv.current.scrollTop = messageDiv.current.scrollHeight;
    }
  });
  return (
    <Fragment>
      <div className="singleMessageBox" ref={messageDiv}>
        {allMessages &&
          allMessages.map((text) => (
            <div
              className="messageText"
              key={text._id}
              style={{
                alignSelf: `${
                  user.id !== text.sender._id ? "self-start" : "self-end"
                }`,
              }}
            >
              {selectChat.isGroupChat ? <GroupImageSetup info={text} /> : ""}

              {text.content}
            </div>
          ))}
      </div>
    </Fragment>
  );
}

export default Messages;
