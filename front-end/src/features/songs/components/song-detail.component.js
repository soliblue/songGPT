import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { HStack, Icon, IconButton, Text } from "native-base";
// internal utils
import { getComplementaryColor } from "src/utils/colors";
// internal
import ABCAudioPlayer from "src/components/abc-audio-player.component";
import { GradientBackground } from "src/components/gradient-background.component";
import { IconButtonWithModal } from "src/components/icon-button-with-modal.component";
import { SongDetailDownload } from "src/features/songs/components/song-detail-download.component";

export const SongDetail = ({ song }) => {
  const navigation = useNavigation();
  let bg = (song?.prompt.match(/#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/) || [])[0];
  const complimentaryColor = bg ? getComplementaryColor(bg) : "black";
  return (
    <GradientBackground
      p={5}
      m={3}
      shadow={1}
      borderRadius="md"
      width={[300, 400]}
      justifyContent="space-between"
      colors={bg ? [bg, bg] : undefined}
    >
      <HStack space={5} justifyContent={"center"} alignItems="center">
        <IconButton
          size="lg"
          icon={
            <Icon
              as={Ionicons}
              name="open-outline"
              color={complimentaryColor}
            />
          }
          onPress={() => {
            navigation.navigate("SongDetail", { songID: song?.id });
          }}
        />
        <SongDetailDownload songID={song?.id} color={complimentaryColor} />
        <IconButtonWithModal
          color={complimentaryColor}
          iconName="chatbox-ellipses"
          Header={<Text>ChatGPT's response</Text>}
          Body={
            <Text>{song?.prompt + "\n\n" + (song?.response || song?.abc)}</Text>
          }
        />
      </HStack>
      {song?.abc && (
        <ABCAudioPlayer
          color={complimentaryColor}
          abc={song?.abc?.replace(/(%%MIDI program)\s+\d+\s+(\d+)/g, "$1 $2")}
        />
      )}
    </GradientBackground>
  );
};
