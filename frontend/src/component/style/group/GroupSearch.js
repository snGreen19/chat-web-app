import React, { Fragment, useState } from "react";
import "./GroupSearch.css";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Input,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { CloseIcon, SmallAddIcon } from "@chakra-ui/icons";
import axios from "axios";
import { ChatState } from "../../../context/ChatProvider";
import ForLoading from "../loading/ForLoading";

function GroupSearch() {
  const { user, setSelectChat, selectedUsers, setSelectedUsers } = ChatState();
  const toast = useToast();
  const [search, setSearch] = useState();
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [users, setUsers] = useState();
  const [groupName, setGroupName] = useState("");
  const [gloading, setGloading] = useState(false);

  const btnRef = React.useRef();

  const handleChangeInput = async (e) => {
    if (e.target.value === undefined || null || "") return;

    setSearch(e.target.value);
    setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get(
        `/api/user/all?search=${search}`,
        config
      );
      setLoading(false);
      setUsers(data);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const SelectUserHandler = (user) => {
    if (
      !selectedUsers.some((selectedUser) => selectedUser.email === user.email)
    ) {
      setSelectedUsers((member) => [...member, user]);
    }
  };
  const handleRemoveUser = (i) => {
    setSelectedUsers((groupUser) =>
      groupUser.filter((user, index) => index !== i)
    );
  };

  const handleCreate = async () => {
    if (selectedUsers.length === 0 || groupName === "") {
      toast({
        title: "Please give groupName and select group member",
        status: "info",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    if (selectedUsers.length === 1) {
      toast({
        title: "Select at least 2 member",
        status: "info",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      setGloading(true);
      const groupMembers = JSON.stringify(
        selectedUsers.map((user) => user._id)
      );

      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.post(
        `/api/chats/group`,
        {
          name: groupName,
          users: groupMembers,
        },
        config
      );
      setGroupName("");
      setSelectedUsers([]);
      setSelectChat(data);
      setGloading(false);
      onClose();
    } catch (error) {
      toast({
        title: "Some Error Occurs",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      console.log(error);
      setGloading(false);
    }
  };

  return (
    <Fragment>
      <Button ref={btnRef} colorScheme="gray" variant="ghost" onClick={onOpen}>
        Create Group <SmallAddIcon />
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader
            display={"flex"}
            flexDirection="column"
            alignItems="center"
            justifyContent={"center"}
            mt="10"
          >
            <Input
              placeholder="Give group name"
              onChange={(e) => setGroupName(e.target.value)}
            />
            <Input
              placeholder="Add user inside group"
              onChange={handleChangeInput}
              m="2"
            />
          </DrawerHeader>

          <DrawerBody>
            {selectedUsers ? (
              <div className="addedMember">
                {selectedUsers.map((user, i) => (
                  <span className="groupUser" key={i}>
                    {user.name}{" "}
                    <CloseIcon onClick={() => handleRemoveUser(i)} />
                  </span>
                ))}
              </div>
            ) : (
              ""
            )}
            {loading ? (
              <ForLoading />
            ) : (
              users &&
              users.map((user) => (
                <div
                  className="groupUserListBox"
                  key={user._id}
                  onClick={() => SelectUserHandler(user)}
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
          </DrawerBody>

          <DrawerFooter>
            <Button
              isLoading={gloading ? true : false}
              colorScheme={"gray"}
              variant="solid"
              onClick={handleCreate}
            >
              Create
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Fragment>
  );
}

export default GroupSearch;
