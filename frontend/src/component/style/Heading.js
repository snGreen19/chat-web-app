import React, { Fragment, useEffect, useState } from "react";
import "./Heading.css";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  MenuButton,
  Menu,
  MenuItem,
  MenuList,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import SearchUser from "./usersNeed/SearchUser";
import GroupSearch from "./group/GroupSearch";

function Heading() {
  const toast = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    toast({
      title: "logout successfully",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    navigate("/");
  };
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("userInfo"));
    setUser(data);
  }, []);
  return (
    user && (
      <Fragment>
        <div className="head-left">
          <SearchUser />{" "}
        </div>
        <div className="head-center">
          Chat App<span className="removeMobile">-({user.name})</span>
        </div>
        <div style={{ zIndex: "5" }}>
          <span className="bellIcon">
            <BellIcon />
          </span>
          <Menu>
            <MenuButton
              variant={"ghost"}
              as={Button}
              rightIcon={<ChevronDownIcon />}
            >
              <div className="head-right">
                <div>
                  <img src={user.image} alt="userImage" />
                </div>
              </div>
            </MenuButton>
            <MenuList>
              <GroupSearch />
              <MenuItem onClick={onOpen}>
                <div>My Profile</div>
              </MenuItem>
              <MenuItem onClick={logoutHandler}>
                {" "}
                <div>Logout</div>
              </MenuItem>
            </MenuList>
          </Menu>
        </div>

        <Fragment>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalCloseButton variant="outline" />
              <ModalBody>
                <div className="modalImageBox">
                  <div>
                    <img src={user.image} alt="" />
                  </div>
                  <h2>{user.email}</h2>
                  <span>{user.name}</span>
                </div>
              </ModalBody>
            </ModalContent>
          </Modal>
        </Fragment>
      </Fragment>
    )
  );
}

export default Heading;
