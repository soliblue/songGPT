import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { IconButton, Icon, Box } from "native-base";
import { useNavigation } from "@react-navigation/native";

export const SongCreateColorPicker = () => {
  const navigation = useNavigation();
  return (
    <Box
      mr={2}
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
        p={1}
        onPress={() => navigation.navigate("SongCreate")}
        icon={<Icon as={Ionicons} name="color-palette" />}
      />
    </Box>
  );
};
