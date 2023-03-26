import React from "react";
import { HStack, Pressable, Skeleton, Text, VStack } from "native-base";
// internal hooks
import { useSong } from "src/features/songs/hooks/useSong";
// internal components
import { Footer } from "src/components/footer.component";
import { Header } from "src/components/header.component";
import { SongCreate } from "src/features/songs/components/song-create.component";
import { SongDetail } from "src/features/songs/components/song-detail.component";

export const SongDetailScreen = ({ route, navigation }) => {
  const { songID } = route.params;
  const song = useSong(songID);
  return (
    <VStack flex={1} bg="white" shadow={3} width={"100%"} space={"md"}>
      <Header />
      <VStack space={"md"} flex={1} justifyContent="center">
        <HStack justifyContent={"center"}>
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
        </HStack>

        <VStack space={"md"}>
          <SongCreate initialSystemMessage={song?.system_message} />
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
