import React from "react";
import { VStack } from "native-base";
// internal components
import { Footer } from "../components/footer.component";
import { Header } from "../components/header.component";
import { SongCreate } from "../components/song-create.component";
import { SongDetail } from "../components/song-detail.component";

export const SongCreateScreen = ({ navigation }) => {
  return (
    <VStack flex={1} bg="white">
      <Header />
      <VStack flex={1} justifyContent="center">
        <VStack space={"2xl"} p={5}>
          {/* <SongDetail songID="700a48d2-c2cd-4c53-a838-0e195427a69b" /> */}
          <SongCreate />
        </VStack>
      </VStack>
      <Footer />
    </VStack>
  );
};
