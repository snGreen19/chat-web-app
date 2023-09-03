// import React, { createContext, useContext, useEffect, useState } from "react";

// const ChatContext = createContext();

// const ChatProvider = ({ children }) => {
//   const [selectedChat, setSelectedChat] = useState();
//   const [user, setUser] = useState();
//   const [notification, setNotification] = useState([]);
//   const [chats, setChats] = useState();

//   useEffect(() => {
//     const userInfo = JSON.parse(localStorage.getItem("userInfo"));
//     setUser(userInfo);
//   }, []);

//   return (
//     <ChatContext.Provider
//       value={{
//         selectedChat,
//         setSelectedChat,
//         user,
//         setUser,
//         notification,
//         setNotification,
//         chats,
//         setChats,
//       }}
//     >
//       {children}
//     </ChatContext.Provider>
//   );
// };

// export const ChatState = () => {
//   return useContext(ChatContext);
// };

// export default ChatProvider;

import React, { createContext, useContext, useEffect, useState } from "react";
const ChatContext = createContext();

function ChatProvider({ children }) {
  const [user, setUser] = useState();
  const [selectChat, setSelectChat] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [messageLoading, setMessageLoading] = useState(false);
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
  }, []);
  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectChat,
        setSelectChat,
        selectedUsers,
        setSelectedUsers,
        messageLoading,
        setMessageLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
