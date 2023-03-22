import React from "react";
import { HexColorPicker } from "react-colorful";
import { Button, Text, VStack } from "native-base";

// internal hooks
import { useCreateSong } from "src/features/songs/hooks/useCreateSong";

// internal components
import { Footer } from "src/components/footer.component";
import { Header } from "src/components/header.component";
import { defaultSystemMessage } from "src/features/songs/components/default-system-message.js";
import { InstrumentList } from "src/features/instruments/components/instrument-list.component";

export const SongCreateScreen = ({ route }) => {
  const [color, setColor] = React.useState("#aabbcc");
  const createSong = useCreateSong();
  const [systemMessage, setSystemMessage] =
    React.useState(defaultSystemMessage);
  const onCreateSong = () => {
    createSong.mutate({
      prompt: color,
      system_message: systemMessage,
    });
  };
  return (
    <VStack flex={1} bg="white" shadow={3} width={"100%"}>
      <Header />
      <VStack
        px={3}
        flex={1}
        bg={color}
        space={"md"}
        alignItems={"center"}
        justifyContent="center"
      >
        <HexColorPicker color={color} onChange={setColor} />
        <InstrumentList
          systemMessage={systemMessage}
          setSystemMessage={setSystemMessage}
        />
        <Button
          // logic
          bg={"lightText"}
          zIndex={-100}
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
      <Footer />
    </VStack>
  );
};
