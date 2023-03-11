import React from "react";
import { VStack, Text, Pressable } from "native-base";
// internal components
import { Footer } from "../components/footer.component";
import { Header } from "../components/header.component";
import { SongCreate } from "../components/song-create.component";

export const SongCreateScreen = ({ navigation }) => {
  return (
    <VStack flex={1} bg="white">
      <Header />
      <VStack flex={1} justifyContent="center">
        <VStack space={"sm"}>
          <SongCreate />
          <Pressable onPress={() => navigation.navigate("SongList")}>
            <Text fontSize={"xs"} color="gray.600" textAlign={"center"}>
              See Examples
            </Text>
          </Pressable>
        </VStack>
      </VStack>
      <Footer />
    </VStack>
  );
};
