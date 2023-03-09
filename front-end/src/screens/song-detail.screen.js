import React from "react";
import { Spinner, VStack } from "native-base";
// internal components
import { Footer } from "../components/footer.component";
import { Header } from "../components/header.component";
import { SongCreate } from "../components/song-create.component";
import { SongDetail } from "../components/song-detail.component";
import { useSong } from "../hooks/useSong";

export const SongDetailScreen = ({ route }) => {
  const { songID } = route.params;
  const song = useSong(songID);
  return (
    <VStack flex={1} bg="white" shadow={3} width={"100%"} space={"md"}>
      <Header />
      <VStack flex={1} justifyContent="center">
        <VStack space={10}>
          {song?.isLoading ? (
            <Spinner color={"black"} />
          ) : (
            <SongDetail song={song?.data} />
          )}
          <SongCreate />
        </VStack>
      </VStack>
      <Footer />
    </VStack>
  );
};
