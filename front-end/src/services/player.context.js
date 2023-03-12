import React from "react";
import { Audio } from "expo-av";

export const PlayerContext = React.createContext(null);

export const PlayerContextProvider = ({ children }) => {
  const [sound, setSound] = React.useState(undefined);
  const [soundFileURL, setSoundFileURL] = React.useState(undefined);
  // states for the player
  const [isLoading, setIsLoading] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const onStatusUpdate = (status) => {
    if (status.isPlaying) {
      setIsLoading(false);
    }
    setIsPlaying(status.isPlaying);
  };

  const playSound = async (soundFileURL) => {
    setIsLoading(true);
    if (soundFileURL) {
      setSoundFileURL(soundFileURL);
      if (!sound) {
        const { sound } = await Audio.Sound.createAsync(
          { uri: soundFileURL },
          { shouldPlay: true },
          onStatusUpdate
        );
        setSound(sound);
      } else {
        await sound.unloadAsync();
        await sound.loadAsync({ uri: soundFileURL }, { shouldPlay: true });
        // await sound.playAsync();
      }
    }
  };

  const pauseSound = async () => {
    await sound.pauseAsync();
  };

  return (
    <PlayerContext.Provider
      value={{
        sound,
        isLoading,
        isPlaying,
        playSound,
        pauseSound,
        soundFileURL,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
