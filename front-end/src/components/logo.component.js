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
              end: [1, 1],
              start: [0, 1],
              colors: ["#1982FC", "#316dca"],
            },
          }}
        />
        <Text fontWeight={"bold"} fontSize="lg">
          SongGPT.xyz
        </Text>
      </HStack>
    </Pressable>
  );
};
