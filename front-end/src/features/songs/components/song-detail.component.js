import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { HStack, Icon, IconButton, ScrollView, Text } from "native-base";
// internal
import { Markdown } from "src/components/markdown.component";
import { GradientBackground } from "src/components/gradient-background.component";
import { SongDetailPlayer } from "src/features/songs/components/song-detail-player.component";
import { SongDetailDownload } from "src/features/songs/components/song-detail-download.component";

export const SongDetail = ({ song }) => {
  const navigation = useNavigation();

  return (
    <GradientBackground
      p={5}
      m={3}
      space={3}
      shadow={1}
      width={400}
      borderRadius="md"
      justifyContent="space-between"
    >
      <ScrollView
        p={2}
        height={150}
        borderRadius="md"
        bg="rgba(255,255,255,0.15)"
      >
        <Text>{song?.prompt}</Text>
      </ScrollView>

      {song?.abc && (
        <ScrollView height={200} borderRadius="md" bg="#263238">
          <Markdown text={"```abc\n" + song?.abc + "\n````"} />
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
