import React from "react";
import { Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { HStack, Text, Button, Icon } from "native-base";
import { Logo } from "./logo.component";

export const Header = () => (
  <HStack p={5} bg="gray.50" justifyContent={"center"}>
    <HStack
      flex={1}
      maxW={992}
      justifyContent="space-between"
      alignItems="center"
    >
      <Logo />

      <Button
        bg="#316dca"
        variant="unstyled"
        borderRadius={"full"}
        onPress={() => {
          Linking.openURL("https://github.com/SoliMouse/songGPT");
        }}
        _text={{ color: "white" }}
        leftIcon={<Icon color="white" as={Ionicons} name="logo-github" />}
      >
        Star on GitHub
      </Button>
    </HStack>
  </HStack>
);
