import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Icon, IconButton, Spinner } from "native-base";
// internal
import { PlayerContext } from "src/services/player.context";
import { useSongFileURL } from "src/features/songs/hooks/useSongFileURL";

export const SongDetailPlayer = ({ songID }) => {
  const player = React.useContext(PlayerContext);
  const wavFileURL = useSongFileURL(songID, "wav");
  const isPlaying = player.soundFileURL === wavFileURL && player.isPlaying;
  const isLoading = player.soundFileURL === wavFileURL && player.isLoading;

  return (
    <IconButton
      size="lg"
      disabled={!wavFileURL || isLoading}
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
          await player.playSound(wavFileURL);
        }
      }}
    />
  );
};
