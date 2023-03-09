import React from "react";
import { HStack, ScrollView, Text, VStack } from "native-base";
import ReactAudioPlayer from "react-audio-player";
// internal
import { useSong } from "../hooks/useSong";
import { Markdown } from "../components/markdown.component";
import { AboutJson } from "../components/about-json.component";

export const SongDetail = ({
  songID = "db23c93a-82c9-47f5-bc9a-ee5a3f878d70",
}) => {
  const song = useSong(songID);
  const filePath = `https://firebasestorage.googleapis.com/v0/b/songgpt-xyz.appspot.com/o/songs%2F${songID}%2F${songID}.wav?alt=media`;
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
      <VStack maxW={"100%"}>
        <VStack
          p={5}
          m={3}
          space={5}
          shadow={1}
          maxWidth={992}
          borderRadius="lg"
          bg={{
            linearGradient: {
              end: [1, 0],
              start: [0, 0],

              colors: [getRandomColor(), getRandomColor()],
            },
          }}
        >
          <Text maxWidth={"100%"}>
            <Text bold>Input: </Text>
            {song?.data?.prompt}
          </Text>
          <ScrollView height={200} borderRadius="md">
            <AboutJson mb={-5} />

            <Markdown
              text={
                "```json\n" +
                JSON.stringify(song?.data?.score, null, 2) +
                "\n````"
              }
            />
          </ScrollView>
          <HStack justifyContent={"center"}>
            <ReactAudioPlayer src={filePath} controls />
          </HStack>
        </VStack>
      </VStack>
    </HStack>
  );
};
