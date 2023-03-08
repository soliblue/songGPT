import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Button, HStack, Icon, Input, VStack } from "native-base";
// internal
import { useCreateSong } from "../hooks/useCreateSong";
import { useNavigation } from "@react-navigation/native";

export const SongCreate = () => {
  const navigation = useNavigation();
  const createSong = useCreateSong();
  const [prompt, setPrompt] = React.useState("");

  React.useEffect(() => {
    if (createSong.isSuccess && navigation) {
      setPrompt("");
      navigation.navigate("SongDetail", { songID: createSong?.data?.data });
    }
  }, [createSong.isSuccess]);

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
          // logic
          value={prompt}
          onChangeText={setPrompt}
          // styling
          px={3}
          py={5}
          shadow={1}
          size={"lg"}
          width={"90%"}
          borderWidth={1}
          isFocused={true}
          autoFocus={true}
          borderRadius="3xl"
          numberOfLines={4}
          variant="unstyled"
          placeholder="Describe the song you want in as much detail as possible"
          _hover={{
            shadow: 5,
          }}
          _focus={{
            shadow: 3,
            placeholderTextColor: "gray.400",
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
          // logic
          onPress={() => createSong.mutate(prompt)}
          isLoading={createSong.isLoading}
          // styling
          py={3}
          shadow={1}
          size={"lg"}
          minWidth={200}
          borderWidth={1}
          disabled={!prompt}
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
