import React from "react";
import { Box, HStack, Text, Pressable } from "native-base";
import { useNavigation } from "@react-navigation/native";

export const Logo = () => {
  const size = 5;
  const navigation = useNavigation();
  return (
    <Pressable
      onPress={() => {
        navigation.navigate("SongCreate");
      }}
    >
      <HStack alignItems={"center"} space={"xs"}>
        <Box
          width={size}
          height={size}
          borderRadius={"10%"}
          alignSelf={"center"}
          bg={{
            linearGradient: {
              colors: ["#1982FC", "#316dca"],
              start: [0, 1],
              end: [1, 1],
            },
          }}
        />
        <Text fontWeight={"bold"} fontSize="lg">
          SongGPT.
          <Text
            style={{
              // Add a linear gradient background to the text
              background: "linear-gradient(to right, #1982FC, #316dca)",
              // Clip the background to the text
              webkitBackgroundClip: "text",
              // Make the text transparent
              WebkitTextFillColor: "transparent",
            }}
          >
            xyz
          </Text>
        </Text>
      </HStack>
    </Pressable>
  );
};
