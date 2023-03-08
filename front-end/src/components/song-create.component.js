import React from "react";
import { useCreateSong } from "../hooks/useCreateSong";
import { Ionicons } from "@expo/vector-icons";
import { Button, HStack, Icon, Input, VStack } from "native-base";

export const SongCreate = () => {
  const createSong = useCreateSong();
  return (
    <HStack flex={1} justifyContent="center">
      <VStack
        flex={1}
        maxW={992}
        space={"lg"}
        alignItems={"center"}
        justifyContent="center"
      >
        <Input
          px={3}
          py={5}
          shadow={1}
          size={"lg"}
          width={"90%"}
          isFocused={true}
          autoFocus={true}
          borderRadius="3xl"
          numberOfLines={4}
          variant="unstyled"
          borderWidth={1}
          placeholder="Describe the song you want in as much detail as possible"
          _focus={{
            shadow: 3,
            placeholderTextColor: "gray.400",
          }}
          _hover={{
            shadow: 5,
          }}
          InputLeftElement={
            <Icon
              ml={3}
              size={"sm"}
              as={Ionicons}
              color="gray.400"
              name="musical-notes"
            />
          }
        />
        <Button
          py={3}
          shadow={1}
          size={"lg"}
          minWidth={200}
          borderWidth={1}
          borderColor="gray.100"
          variant={"unstyled"}
          _hover={{
            shadow: 3,
          }}
          _text={{
            fontSize: "lg",
            color: "gray.800",
            fontWeight: "semibold",
          }}
        >
          Generate
        </Button>
      </VStack>
    </HStack>
  );
};
