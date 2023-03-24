import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { HStack, Icon, IconButton, Text } from "native-base";
// internal
import ABCAudioPlayer from "src/components/abc-audio-player.component";
import { GradientBackground } from "src/components/gradient-background.component";
import { IconButtonWithModal } from "src/components/icon-button-with-modal.component";
import { SongDetailDownload } from "src/features/songs/components/song-detail-download.component";

export const SongDetail = ({ song }) => {
  const navigation = useNavigation();

  return (
    <GradientBackground
      p={5}
      m={3}
      shadow={1}
      width={[300, 400]}
      borderRadius="md"
      justifyContent="space-between"
    >
      <HStack space={5} justifyContent={"center"} alignItems="center">
        <IconButton
          size="lg"
          icon={<Icon as={Ionicons} name="open-outline" />}
          onPress={() => {
            navigation.navigate("SongDetail", { songID: song?.id });
          }}
        />
        <SongDetailDownload songID={song?.id} />
        <IconButtonWithModal
          iconName="chatbox-ellipses"
          Header={<Text>ChatGPT's response</Text>}
          Body={
            <Text>{song?.prompt + "\n\n" + (song?.response || song?.abc)}</Text>
          }
        />
      </HStack>
      {song?.abc && (
        <ABCAudioPlayer
          abc={song?.abc?.replace(/(%%MIDI program)\s+\d+\s+(\d+)/g, "$1 $2")}
        />
      )}
    </GradientBackground>
  );
};
