import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Button, HStack, Icon, Input, VStack } from "native-base";
// internal components
import { Footer } from "./footer.component";
import { Header } from "./header.component";

export const InputBar = () => (
  <Input
    px={3}
    py={5}
    shadow={1}
    size={"lg"}
    width={"90%"}
    isFocused={true}
    autoFocus={true}
    borderRadius="3xl"
    numberOfLines={4}
    variant="unstyled"
    borderWidth={1}
    placeholder="Describe the song you want in as much detail as possible"
    _focus={{
      shadow: 3,
      placeholderTextColor: "gray.400",
    }}
    _hover={{
      shadow: 5,
    }}
    InputLeftElement={
      <Icon
        ml={3}
        size={"sm"}
        as={Ionicons}
        color="gray.400"
        name="musical-notes"
      />
    }
  />
);
