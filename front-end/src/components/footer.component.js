import React from "react";
import { Linking } from "react-native";
import { HStack, Text, Pressable, VStack } from "native-base";

const openURL = (url) => {
  Linking.openURL(url);
};

const FooterLink = ({ url, children }) => (
  <Pressable onPress={() => openURL(url)}>
    <Text textDecoration="underline">{children}</Text>
  </Pressable>
);

export const Footer = () => (
  <VStack bg="gray.50" py={3} space={"sm"}>
    <HStack justifyContent={"center"}>
      <FooterLink url="https://discord.gg/ArjurfDCCy">
        Join our Discord
      </FooterLink>
    </HStack>
    <HStack justifyContent={"center"}>
      <Text
        fontSize={"2xs"}
        color="black"
        fontWeight={"semibold"}
        letterSpacing="lg"
      >
        Made with ❤️ by{" "}
        <FooterLink url="https://twitter.com/Tanovski">Jeffry</FooterLink>,{" "}
        <FooterLink url="https://twitter.com/_xSoli">Soli</FooterLink>,{" "}
        <FooterLink url="https://www.linkedin.com/in/hatem-soliman-12908a1b3/">
          Tommy
        </FooterLink>{" "}
        &{" "}
        <FooterLink url="https://www.linkedin.com/in/justin-dorber-370581130/">
          Justin
        </FooterLink>
      </Text>
    </HStack>
  </VStack>
);
