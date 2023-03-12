import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { HStack, Icon, IconButton, Spinner, Text } from "native-base";
import { PlayerContext } from "../services/player.context";
import { GradientBackground } from "./gradient-background.component";

export const SongDetailSmall = ({ song, size = 300 }) => {
  const navigation = useNavigation();
  const player = React.useContext(PlayerContext);

  const filePath = `https://firebasestorage.googleapis.com/v0/b/songgpt-xyz.appspot.com/o/songs%2F${song?.id}%2F${song?.id}.wav?alt=media`;

  const isPlaying = player.soundFileURL === filePath && player.isPlaying;
  const isLoading = player.soundFileURL === filePath && player.isLoading;

  return (
    <GradientBackground
      p={5}
      m={3}
      space={3}
      shadow={1}
      width={size}
      borderRadius="md"
      height={size * 0.5}
      justifyContent="space-between"
    >
      <HStack justifyContent="flex-end"></HStack>
      <Text p={2} noOfLines={3} borderRadius="md" bg="rgba(255,255,255,0.15)">
        {song?.prompt}
      </Text>

      <HStack space={5} justifyContent={"center"} alignItems="center">
        <IconButton
          size="lg"
          disabled={!filePath || isLoading}
          icon={
            isLoading ? (
              <Spinner size={"sm"} />
            ) : (
              <Icon as={Ionicons} name={isPlaying ? "pause" : "play"} />
            )
          }
          onPress={async () => {
            if (isPlaying) {
              await player.pauseSound();
            } else {
              await player.playSound(filePath);
            }
          }}
        />

        <IconButton
          size="lg"
          icon={<Icon as={Ionicons} name="open-outline" />}
          onPress={() => {
            navigation.navigate("SongDetail", { songID: song?.id });
          }}
        />
      </HStack>
    </GradientBackground>
  );
};
