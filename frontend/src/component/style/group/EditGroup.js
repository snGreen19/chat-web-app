import React, { Fragment, useEffect, useState } from "react";
import "./EditGroup.css";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  ModalHeader,
  Input,
  Button,
  Box,
  useToast,
} from "@chakra-ui/react";
import { ChatState } from "../../../context/ChatProvider";
import axios from "axios";
import { CloseIcon } from "@chakra-ui/icons";
import UpdateLoading from "../loading/UpdateLoading";

function EditGroup() {
  const { selectChat, setSelectChat, user } = ChatState();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [updateGroupName, setUpdateGroupName] = useState(selectChat.chatName);
  const [search, setSearch] = useState(selectChat.chatName);
  const [groupUpdateLading, setGroupUpdateLading] = useState(false);
  const [existsUsers, setExistsUsers] = useState(selectChat.users);
  const [users, setUsers] = useState();

  //remvoe from group .....................................................
  const handleRemoveUserUpdate = async (userId) => {
    if (selectChat.users.length < 4) return;

    if (selectChat.groupAdmin._id === userId) {
      toast({
        title: "you can not delete himself",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    if (selectChat.groupAdmin._id === user.id || userId === user.id) {
      setLoading(true);
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };
        const { data } = await axios.put(
          `/api/chats/groupremove`,
          {
            chatId: selectChat._id,
            userId,
          },
          config
        );
        setExistsUsers(data.users);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast({
          title: "Some Error Occurs",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      }
    } else {
      toast({
        title: "You are not a group admin",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };
  console.log("select", selectChat);
  //add in group .....................................................
  const addUserHandler = async (userId) => {
    const isExists = existsUsers.filter((user) => user._id !== userId);
    if (isExists.length < existsUsers.length) {
      toast({
        title: "The users is already exists",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.put(
        `/api/chats/groupadd`,
        {
          chatId: selectChat._id,
          userId,
        },
        config
      );
      setExistsUsers(data.users);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Some Error Occurs",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  // update group users .....................................................
  const updateGroupInfoHandler = async () => {
    if (selectChat.chatName !== updateGroupName) {
      try {
        setLoading(true);
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };
        const { data } = await axios.put(
          `/api/chats/rename`,
          {
            chatId: selectChat._id,
            chatName: updateGroupName,
          },
          config
        );
        setSelectChat(data);

        setLoading(false);
        onClose();
      } catch (error) {
        setLoading(false);
        toast({
          title: "Some Error Occurs",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        onClose();
      }
    } else {
      onClose();
    }
  };

  // new group name input  .....................................................
  const changeUpdateInput = async (e) => {
    if (e.target.value === undefined || null || "") return;

    setSearch(e.target.value);
    setGroupUpdateLading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get(
        `/api/user/all?search=${search}`,
        config
      );
      setGroupUpdateLading(false);
      setUsers(data);
    } catch (error) {
      console.log(error);
      setGroupUpdateLading(false);
    }
  };

  useEffect(() => {
    setUpdateGroupName(selectChat.chatName);
  }, [selectChat, user]);

  return (
    <Fragment>
      {selectChat && (
        <Fragment>
          <i
            className="fa-solid fa-pen-to-square editGroupIcon"
            onClick={onOpen}
          ></i>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalCloseButton variant="outline" />
              <ModalHeader
                display={"Flex"}
                alignItems={"center"}
                justifyContent={"center"}
                flexDirection={"column"}
                mt={"8"}
              >
                <Box mb={"4"}>Group Info</Box>{" "}
                <Input
                  placeholder="Give group name"
                  value={updateGroupName}
                  onChange={(e) => setUpdateGroupName(e.target.value)}
                />
                <Input
                  placeholder="Add User"
                  onChange={changeUpdateInput}
                  m="2"
                />
              </ModalHeader>
              <ModalBody>
                <div className="addedMember">
                  {existsUsers.map((user, i) => (
                    <span className="groupUser" key={i}>
                      {user.name}{" "}
                      <CloseIcon
                        onClick={() => handleRemoveUserUpdate(user._id)}
                      />
                    </span>
                  ))}
                </div>
                {groupUpdateLading ? (
                  <UpdateLoading />
                ) : (
                  users &&
                  users.slice(0, 2).map((user) => (
                    <div
                      className="groupUserListBox"
                      key={user._id}
                      onClick={() => addUserHandler(user._id)}
                    >
                      <div className="image">
                        <img src={user.image} alt="userImage" />
                      </div>
                      <div className="info">
                        <h2>{user.name}</h2>
                        <p>{user.email}</p>
                      </div>
                    </div>
                  ))
                )}
              </ModalBody>
              <Box
                display={"flex"}
                alignItems={"center"}
                justifyContent={"flex-end"}
              >
                <Button
                  ml={"3"}
                  onClick={() => handleRemoveUserUpdate(user.id)}
                >
                  Leave
                </Button>
                <Button
                  m={"3"}
                  onClick={updateGroupInfoHandler}
                  isLoading={loading}
                >
                  update
                </Button>
              </Box>
            </ModalContent>
          </Modal>
        </Fragment>
      )}
    </Fragment>
  );
}

export default EditGroup;
