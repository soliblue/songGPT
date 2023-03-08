import React from "react";
import { VStack } from "native-base";
// internal components
import { Footer } from "../components/footer.component";
import { Header } from "../components/header.component";
import { SongCreate } from "../components/song-create.component";
import { SongDetail } from "../components/song-detail.component";

export const SongDetailScreen = ({ route }) => {
  const { songID } = route.params;
  console.log(songID);
  return (
    <VStack flex={1} bg="white">
      <Header />
      <VStack flex={1} justifyContent="center">
        <VStack space={10}>
          <SongDetail songID={songID} />
          <SongCreate />
        </VStack>
      </VStack>
      <Footer />
    </VStack>
  );
};
