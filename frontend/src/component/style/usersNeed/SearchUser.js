import { Search2Icon } from "@chakra-ui/icons";
import React, { Fragment, useState } from "react";
import "./SearchUser.css";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Button,
  Input,
  useToast,
} from "@chakra-ui/react";
import { ChatState } from "../../../context/ChatProvider";
import axios from "axios";
import ForLoading from "../loading/ForLoading";

function SearchUser() {
  const toast = useToast();
  const { user, setSelectChat } = ChatState();
  const [users, setUsers] = useState();
  const [search, setSearch] = useState();
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "type something for search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } else {
      try {
        setUsers("");
        setLoading(true);
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };
        const { data } = await axios.get(
          `/api/user/all?search=${search}`,
          config
        );
        setUsers(data);

        setLoading(false);
      } catch (error) {
        toast({
          title: "some error occers",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        console.log(error);
        setLoading(false);
      }
    }
  };
  const CreateChatHandler = async (selectUser) => {
    if (!selectUser) {
      toast({
        title: "please select user to chat",
        status: "info",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
    onClose();
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.post(
        `/api/chats/access`,
        { userId: selectUser._id },
        config
      );
      console.log(data);
      setSelectChat(data);
    } catch (error) {
      toast({
        title: "some error occers",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <Fragment>
      <div className="searchUser" onClick={onOpen}>
        <span className="removeMobile"> Search User </span>
        <Search2Icon />
      </div>
      <Fragment>
        <Drawer
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          finalFocusRef={btnRef}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader
              display={"flex"}
              alignItems="center"
              justifyContent={"center"}
              mt="10"
            >
              <Input
                placeholder="Enter name or email"
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button m={"1"} onClick={handleSearch}>
                <Search2Icon />
              </Button>
            </DrawerHeader>

            <DrawerBody>
              {users
                ? users.map((user) => (
                    <div
                      className="usersListbox"
                      key={user._id}
                      onClick={(e) => CreateChatHandler(user)}
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
                : ""}
              {loading ? <ForLoading /> : ""}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Fragment>
    </Fragment>
  );
}
export default SearchUser;
