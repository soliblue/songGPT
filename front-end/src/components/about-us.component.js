import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Box, Icon, IconButton, Popover, Text } from "native-base";

export const AboutUs = () => {
  return (
    <Popover
      trigger={(triggerProps) => {
        return (
          <Box
            mr={3}
            borderRadius={"full"}
            bg={{
              linearGradient: {
                end: [1, 0],
                start: [0, 0],
                colors: ["#1982FC", "#316dca"],
              },
            }}
          >
            <IconButton
              p={0.5}
              size="xs"
              icon={<Icon name="information-outline" as={Ionicons} />}
              // logic
              {...triggerProps}
            />
          </Box>
        );
      }}
    >
      <Popover.Content mx={5} maxWidth={500}>
        <Popover.Header key="header">
          <Text fontWeight={"semibold"}>What is songGPT?</Text>
        </Popover.Header>
        <Popover.Body key="body">
          <Text
            maxWidth={500}
            color="gray.700"
            alignSelf="center"
            fontWeight={"normal"}
          >
            SongGPT is an experimental open-source project that explores the
            potential of Language Models in generating original and customizable
            musical compositions. You can read more about it on our GitHub page.
          </Text>
        </Popover.Body>
      </Popover.Content>
    </Popover>
  );
};
