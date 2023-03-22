import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Icon, IconButton, Popover } from "native-base";

export const IconButtonWithPopover = ({
  iconName,
  PopoverHeader,
  PopoverBody,
}) => {
  return (
    <Popover
      trigger={(triggerProps) => {
        return (
          <IconButton
            size="lg"
            {...triggerProps}
            icon={<Icon name={iconName} as={Ionicons} />}
          />
        );
      }}
    >
      <Popover.Content mx={5} maxWidth={500}>
        <Popover.Header key="header">{PopoverHeader}</Popover.Header>
        <Popover.Body key="body">{PopoverBody}</Popover.Body>
      </Popover.Content>
    </Popover>
  );
};
