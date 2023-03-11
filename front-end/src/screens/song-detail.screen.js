import React from "react";
import { Pressable, Skeleton, Text, VStack } from "native-base";
// internal components
import { Footer } from "../components/footer.component";
import { Header } from "../components/header.component";
import { SongCreate } from "../components/song-create.component";
import { SongDetail } from "../components/song-detail.component";
import { useSong } from "../hooks/useSong";

export const SongDetailScreen = ({ route, navigation }) => {
  const { songID } = route.params;
  const song = useSong(songID);
  return (
    <VStack flex={1} bg="white" shadow={3} width={"100%"} space={"md"}>
      <Header />
      <VStack space={"md"} flex={1} justifyContent="center">
        {song?.isLoading ? (
          <Skeleton
            m={3}
            key={songID}
            height={400}
            width={"90%"}
            alignSelf="center"
            borderRadius={"md"}
          />
        ) : (
          <SongDetail song={song?.data} />
        )}
        <VStack space={"md"}>
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
