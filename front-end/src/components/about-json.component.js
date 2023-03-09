import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Box, Icon, IconButton, Popover, Pressable, Text } from "native-base";

export const AboutJson = ({ ...props }) => {
  return (
    <Popover
      trigger={(triggerProps) => {
        return (
          <Pressable
            {...props}
            icon={<Icon name="information-outline" as={Ionicons} />}
            // logic
            {...triggerProps}
          >
            <Text underline>What is this JSON file?</Text>
          </Pressable>
        );
      }}
    >
      <Popover.Content mx={5} maxWidth={500}>
        <Popover.Header key="header">
          <Text fontWeight={"semibold"}>What is this JSON file?</Text>
        </Popover.Header>
        <Popover.Body key="body">
          <Text mx={5} color="gray.700" fontWeight={"normal"}>
            We taught ChatGPT how to produce musical compositions in JSON format
            shown below. We then convert this JSON file into a proper MIDI file
            before playing it back to you. For more information about our
            process, please visit our GitHub page.
          </Text>
        </Popover.Body>
      </Popover.Content>
    </Popover>
  );
};
