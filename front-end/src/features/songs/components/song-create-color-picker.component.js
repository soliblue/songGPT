import React, { useState } from "react";
import { SliderPicker } from "react-color";
import { Ionicons } from "@expo/vector-icons";
import { IconButton, Modal, Icon, Text, VStack, Box } from "native-base";

export const SongCreateColorPicker = ({ setPrompt }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#000000");

  const handleChangeComplete = (color) => {
    setSelectedColor(color.hex);
    setPrompt(color.hex);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={setIsOpen}>
        <Modal.Content>
          <Modal.Body>
            <Modal.CloseButton />

            <VStack space={"lg"} pt={10}>
              <Text>
                Pick a color based on how you feel, and our system will generate
                a personalized soundtrack inspired by that choice
              </Text>
              <SliderPicker
                color={selectedColor}
                onChange={handleChangeComplete}
              />
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <Box
        mr={2}
        borderRadius={"full"}
        bg={{
          linearGradient: {
            end: [1, 0],
            start: [0, 0],
            colors: ["#1982FC", "#316dca"],
          },
        }}
      >
        <IconButton
          p={1}
          onPress={() => setIsOpen(true)}
          icon={<Icon as={Ionicons} name="color-palette" />}
        />
      </Box>
    </>
  );
};
