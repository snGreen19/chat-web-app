import React, { Fragment } from "react";
import { ChatState } from "../../../context/ChatProvider";

function GroupImageSetup({ info, allMessages }) {
  const { user } = ChatState();

  return (
    <Fragment>
      <div className="senderImage">
        {user.image === info.sender.image ? (
          ""
        ) : (
          <img src={info.sender.image} alt="senderImage" />
        )}
      </div>
    </Fragment>
  );
}

export default GroupImageSetup;
