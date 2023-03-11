import React from "react";
import { FlatList, HStack, Spinner, VStack, Text, Skeleton } from "native-base";

// internal components
import { Footer } from "../components/footer.component";
import { Header } from "../components/header.component";
import { SongCreate } from "../components/song-create.component";
import { useSongs } from "../hooks/useSongs";
import { SongDetailSmall } from "../components/song-detail-small.component";

const SongListSkeleton = () => (
  <FlatList
    horizontal={true}
    data={[1, 2, 3, 4, 5]}
    showsVerticalScrollIndicator={false}
    showsHorizontalScrollIndicator={false}
    renderItem={({ item }) => (
      <Skeleton
        m={3}
        key={item}
        width={400}
        height={400 * 0.5}
        borderRadius={"md"}
      />
    )}
  />
);

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
          {/* repeat 3 times the sekeleton */}
          {songs?.isLoading ? (
            <SongListSkeleton />
          ) : (
            <FlatList
              data={songsData}
              horizontal={true}
              keyExtractor={(song) => song.id}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <SongDetailSmall song={item} size={400} />
              )}
              onEndReached={() => {
                if (songs.hasNextPage && !songs.isFetchingNextPage) {
                  songs.fetchNextPage();
                }
              }}
            />
          )}
        </VStack>
        <SongCreate />
      </VStack>

      <Footer />
    </VStack>
  );
};
