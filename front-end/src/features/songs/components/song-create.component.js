import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Button, HStack, Input, VStack, FormControl, Text } from "native-base";
// internal hooks
import { useCreateSong } from "src/features/songs/hooks/useCreateSong";
// internal components
import { AboutUs } from "src/components/about-us.component";
import { defaultSystemMessage } from "src/features/songs/components/default-system-message.js";
import { SongCreateSettings } from "src/features/songs/components/song-create-settings.component";

export const SongCreate = ({ initialSystemMessage = defaultSystemMessage }) => {
  const navigation = useNavigation();
  const createSong = useCreateSong();
  const [prompt, setPrompt] = React.useState("");
  const [systemMessage, setSystemMessage] =
    React.useState(initialSystemMessage);

  React.useEffect(() => {
    if (createSong.isSuccess && navigation) {
      setPrompt("");
      navigation.navigate("SongDetail", { songID: createSong?.data?.data });
    }
  }, [createSong.isSuccess]);

  const onCreateSong = () => {
    createSong.mutate({
      prompt: prompt,
      system_message: systemMessage,
    });
  };

  return (
    <HStack justifyContent="center">
      <VStack
        flex={1}
        maxW={992}
        space={"2xl"}
        alignItems={"center"}
        justifyContent="center"
      >
        <FormControl>
          <VStack alignItems={"center"} space={"sm"}>
            <Input
              // logic
              value={prompt}
              maxLength={1000}
              onChangeText={setPrompt}
              // styling
              px={3}
              py={5}
              shadow={1}
              size={"lg"}
              width={"90%"}
              borderWidth={1}
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
                <SongCreateSettings
                  systemMessage={systemMessage}
                  setSystemMessage={setSystemMessage}
                />
              }
              InputRightElement={<AboutUs />}
            />
            <Text
              mx={5}
              maxWidth={400}
              fontSize={"2xs"}
              color={"gray.700"}
              alignSelf={"center"}
            >
              Paste your favorite quote or poem and let our language model
              generate a beautiful and original piece of music for you. Please
              note, that right now we are only limited to using the{" "}
              <Text fontWeight="semibold">
                Piano, Violin, Cello, Strings, Viola, Sax, Guitar, Clarinet,
                Xylophone & Flute
              </Text>
            </Text>
          </VStack>
        </FormControl>

        <Button
          // logic
          onPress={onCreateSong}
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
        {createSong.isLoading && (
          <Text>This normally takes less than 60 seconds</Text>
        )}
      </VStack>
    </HStack>
  );
};
