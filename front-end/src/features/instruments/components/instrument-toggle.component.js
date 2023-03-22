import React from "react";
import { Switch, Text, VStack } from "native-base";

export const InstrumentToggle = ({
  instrumentName,
  channel,
  onToggle,
  isEnabled,
}) => {
  return (
    <VStack space={2} m={2} alignItems="center">
      <Text maxW={100} noOfLines={1}>
        {instrumentName}
      </Text>
      <Switch
        colorScheme="blue"
        isChecked={isEnabled}
        onToggle={() => {
          onToggle(instrumentName, channel, !isEnabled);
        }}
      />
    </VStack>
  );
};
