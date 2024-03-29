import React from "react";
import { VStack } from "native-base";

export const GradientBackground = ({ colors, children, ...props }) => {
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
    <VStack {...props} bg={colors ? colors[0] : getRandomColor()}>
      {children}
    </VStack>
  );
};
