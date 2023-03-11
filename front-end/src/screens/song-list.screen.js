import React from "react";
import { FlatList, VStack } from "native-base";

// internal components
import { Footer } from "../components/footer.component";
import { Header } from "../components/header.component";
import { SongCreate } from "../components/song-create.component";
import { useSongs } from "../hooks/useSongs";
import { SongDetailSmall } from "../components/song-detail-small.component";

export const SongListScreen = ({ route }) => {
  const songs = useSongs(5);
  const songsData = songs.data?.pages
    .flatMap((page) => page)
    .map((doc) => doc.data());
  return (
    <VStack flex={1} bg="white" shadow={3} width={"100%"} space={"md"}>
      <Header />
      <VStack flex={1} space={"xl"} justifyContent="center">
        <VStack>
          <FlatList
            flex={1}
            data={songsData}
            horizontal={true}
            keyExtractor={(song) => song.id}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <SongDetailSmall song={item} size={[300, 400]} />
            )}
            onEndReached={() => {
              if (songs.hasNextPage && !songs.isFetchingNextPage) {
                songs.fetchNextPage();
              }
            }}
          />
        </VStack>
        <SongCreate />
      </VStack>

      <Footer />
    </VStack>
  );
};
