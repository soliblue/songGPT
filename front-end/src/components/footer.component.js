import React from "react";
import { Linking } from "react-native";
import { HStack, Text, Pressable, VStack } from "native-base";

export const Footer = () => (
  <VStack bg="gray.50" py={3} space={"sm"}>
    <HStack justifyContent={"center"}>
      <Pressable
        onPress={() => {
          Linking.openURL("https://discord.gg/ArjurfDCCy");
        }}
      >
        <Text
          fontSize={"2xs"}
          color="black"
          fontWeight={"semibold"}
          letterSpacing="lg"
        >
          Join our discord
        </Text>
      </Pressable>
    </HStack>
    <HStack justifyContent={"center"}>
      <Text
        fontSize={"2xs"}
        color="black"
        fontWeight={"semibold"}
        letterSpacing="lg"
      >
        Made with ❤️ by{" "}
        <Pressable
          onPress={() => {
            Linking.openURL("https://twitter.com/Tanovski");
          }}
        >
          <Text>Jeffry</Text>
        </Pressable>
        ,
        <Pressable
          onPress={() => {
            Linking.openURL("https://twitter.com/SoliMouse");
          }}
        >
          <Text> Soli</Text>
        </Pressable>
        ,
        <Pressable
          onPress={() => {
            Linking.openURL(
              "https://www.linkedin.com/in/hatem-soliman-12908a1b3/"
            );
          }}
        >
          <Text> Tommy </Text>
        </Pressable>
        &
        <Pressable
          onPress={() => {
            Linking.openURL(
              "https://www.linkedin.com/in/justin-dorber-370581130/"
            );
          }}
        >
          <Text> Justin</Text>
        </Pressable>
      </Text>
    </HStack>
  </VStack>
);
