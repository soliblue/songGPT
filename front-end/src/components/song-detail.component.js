import React from "react";
import ReactAudioPlayer from "react-audio-player";
import { HStack, ScrollView, Text, VStack } from "native-base";
// internal
import { Markdown } from "../components/markdown.component";
import { AboutJson } from "../components/about-json.component";
import { GradientBackground } from "./gradient-background.component";

export const SongDetail = ({ song }) => {
  const filePath = `https://firebasestorage.googleapis.com/v0/b/songgpt-xyz.appspot.com/o/songs%2F${song?.id}%2F${song?.id}.wav?alt=media`;

  return (
    <HStack justifyContent={"center"}>
      <VStack maxW={"100%"}>
        <GradientBackground
          p={5}
          m={3}
          space={5}
          shadow={1}
          maxWidth={992}
          borderRadius="lg"
        >
          <Text
            p={2}
            borderRadius="md"
            maxWidth={"100%"}
            bg="rgba(255,255,255,0.5)"
          >
            <Text bold>Input: </Text>
            {song?.prompt}
          </Text>
          <ScrollView height={200} borderRadius="md" bg="#263238" p={3}>
            <AboutJson />
            <Markdown
              text={
                "```json\n" + JSON.stringify(song?.score, null, 2) + "\n````"
              }
            />
          </ScrollView>
          <HStack justifyContent={"center"}>
            <ReactAudioPlayer src={filePath} controls />
          </HStack>
        </GradientBackground>
      </VStack>
    </HStack>
  );
};
