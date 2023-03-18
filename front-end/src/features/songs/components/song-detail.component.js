import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { HStack, Icon, IconButton, ScrollView, Text } from "native-base";
// internal
import { Markdown } from "src/components/markdown.component";
import { GradientBackground } from "src/components/gradient-background.component";
import { SongDetailPlayer } from "src/features/songs/components/song-detail-player.component";
import { SongDetailDownload } from "src/features/songs/components/song-detail-download.component";
import { SongDetailMusicSheet } from "./song-detail-music-sheet.component";

export const SongDetail = ({ song }) => {
  const navigation = useNavigation();

  return (
    <GradientBackground
      p={5}
      m={3}
      space={3}
      shadow={1}
      width={[300, 400]}
      borderRadius="md"
      justifyContent="space-between"
    >
      {song?.abc && (
        <ScrollView
          height={150}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <SongDetailMusicSheet abc={song?.abc} />
        </ScrollView>
      )}

      <HStack space={5} justifyContent={"center"} alignItems="center">
        <SongDetailPlayer songID={song?.id} />
        <IconButton
          size="lg"
          icon={<Icon as={Ionicons} name="open-outline" />}
          onPress={() => {
            navigation.navigate("SongDetail", { songID: song?.id });
          }}
        />
        <SongDetailDownload songID={song?.id} />
      </HStack>
    </GradientBackground>
  );
};
