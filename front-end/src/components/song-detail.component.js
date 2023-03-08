import React from "react";
import { HStack, Text, VStack } from "native-base";
import ReactAudioPlayer from "react-audio-player";
// internal
import { useSong } from "../hooks/useSong";

export const SongDetail = ({
  songID = "db23c93a-82c9-47f5-bc9a-ee5a3f878d70",
}) => {
  const song = useSong(songID);
  const filePath = `https://firebasestorage.googleapis.com/v0/b/songgpt-xyz.appspot.com/o/songs%2F${songID}%2F${songID}.wav?alt=media`;
  console.log(filePath);
  const getRandomColor = (number) => {
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
    <HStack justifyContent={"center"}>
      <VStack
        bg={{
          linearGradient: {
            end: [1, 0],
            start: [0, 0],

            colors: [getRandomColor(), getRandomColor()],
          },
        }}
        shadow={1}
        p={5}
        m={3}
        space={5}
        borderRadius="lg"
      >
        <Text textAlign={"center"} fontWeight="bold">
          {song?.data?.prompt}
        </Text>
        <ReactAudioPlayer src={filePath} controls />
      </VStack>
    </HStack>
  );
};
