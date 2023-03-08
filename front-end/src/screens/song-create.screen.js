import React from "react";
import { VStack } from "native-base";
// internal components
import { Footer } from "../components/footer.component";
import { Header } from "../components/header.component";
import { SongCreate } from "../components/song-create.component";

export const SongCreateScreen = ({ navigation }) => {
  return (
    <VStack flex={1} bg="white">
      <Header />
      <VStack flex={1} justifyContent="center">
        <VStack space={10}>
          <SongCreate />
        </VStack>
      </VStack>
      <Footer />
    </VStack>
  );
};
