import React from "react";
import { Popover, Pressable } from "native-base";

export const PressableWithPopover = ({
  PressableChildren,
  PopoverHeader,
  PopoverBody,
}) => {
  return (
    <Popover
      trigger={(triggerProps) => {
        return (
          <Pressable {...props} {...triggerProps}>
            {PressableChildren}
          </Pressable>
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
