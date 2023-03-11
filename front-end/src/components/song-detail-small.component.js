import React from "react";
import { Ionicons } from "@expo/vector-icons";
import ReactAudioPlayer from "react-audio-player";
import { useNavigation } from "@react-navigation/native";

import { Box, HStack, Icon, IconButton, Text, VStack } from "native-base";

export const SongDetailSmall = ({ song, size = 300 }) => {
  const navigation = useNavigation();
  const filePath = `https://firebasestorage.googleapis.com/v0/b/songgpt-xyz.appspot.com/o/songs%2F${song?.id}%2F${song?.id}.wav?alt=media`;
  const getRandomColor = () => {
    const colors = [
      "#F9D71C",
      "#87CEEB",
      "#50C878",
      "#E6E6FA",
      "#FFE5B4",
      "#FF7F50",
      "#98FF98",
      "#F4C2C2",
      "#FFA07A",
      "#C8A2C8",
    ];
    const index = Math.floor(Math.random() * colors.length);
    return colors[index];
  };
  return (
    <VStack
      p={5}
      m={3}
      space={3}
      shadow={1}
      width={size}
      borderRadius="md"
      height={size * 0.75}
      justifyContent="space-between"
      bg={{
        linearGradient: {
          end: [1, 0],
          start: [0, 0],

          colors: [getRandomColor(), getRandomColor()],
        },
      }}
    >
      <HStack justifyContent="flex-end"></HStack>
      <Text p={2} noOfLines={3} borderRadius="md" bg="rgba(255,255,255,0.15)">
        {song?.prompt}
      </Text>

      <HStack space={5} justifyContent={"center"}>
        <ReactAudioPlayer src={filePath} controls />

        <IconButton
          size="lg"
          icon={<Icon as={Ionicons} name="open-outline" />}
          onPress={() => {
            navigation.navigate("SongDetail", { songID: song?.id });
          }}
        />
      </HStack>
    </VStack>
  );
};
