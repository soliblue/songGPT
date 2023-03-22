import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Icon, IconButton, Modal } from "native-base";

export const IconButtonWithModal = ({ iconName, Header, Body }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const toggleModal = () => setIsOpen(!isOpen);
  return (
    <>
      <Modal isOpen={isOpen} onClose={toggleModal}>
        <Modal.Content mx={5} maxWidth={500}>
          <Modal.Header key="header">{Header}</Modal.Header>
          <Modal.Body key="body">{Body}</Modal.Body>
        </Modal.Content>
      </Modal>
      <IconButton
        size="lg"
        onPress={toggleModal}
        icon={<Icon name={iconName} as={Ionicons} />}
      />
    </>
  );
};
