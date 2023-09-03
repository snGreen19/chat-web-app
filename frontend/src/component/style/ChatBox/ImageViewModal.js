import React, { Fragment } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { ChatState } from "../../../context/ChatProvider";

function ImageViewModal({ isOpen, onClose }) {
  const { selectChat, user } = ChatState();
  return (
    <Fragment>
      {selectChat && user && (
        <Fragment>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalCloseButton backgroundColor={"white"} />
              <ModalBody>
                <img
                  src={
                    selectChat.users[1]._id === user.id
                      ? selectChat.users[0].image
                      : selectChat.users[1].image
                  }
                  alt=""
                  style={{ width: "100%" }}
                />
              </ModalBody>
            </ModalContent>
          </Modal>
        </Fragment>
      )}
    </Fragment>
  );
}

export default ImageViewModal;
