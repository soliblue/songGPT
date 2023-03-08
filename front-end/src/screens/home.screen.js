import React from "react";
import { VStack } from "native-base";
// internal components
import { Footer } from "../components/footer.component";
import { Header } from "../components/header.component";
import { SongCreate } from "../components/song-create.component";

export const HomeScreen = () => {
  return (
    <VStack flex={1} bg="white">
      <Header />
      <SongCreate />
      <Footer />
    </VStack>
  );
};
