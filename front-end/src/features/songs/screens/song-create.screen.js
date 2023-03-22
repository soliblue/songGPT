import React from "react";
import { HexColorPicker } from "react-colorful";
import { Button, HStack, Text, VStack } from "native-base";

// internal hooks
import { useCreateSong } from "src/features/songs/hooks/useCreateSong";

// internal components
import { Footer } from "src/components/footer.component";
import { Header } from "src/components/header.component";
import { defaultSystemMessage } from "src/features/songs/components/default-system-message.js";
import { InstrumentList } from "src/features/instruments/components/instrument-list.component";

const getComplementaryColor = (hexColor) => {
  const color = hexColor.slice(1); // remove the hash symbol from the string
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000; // YIQ color model for brightness
  return yiq >= 128 ? "#000000" : "#FFFFFF"; // return black or white based on brightness
};

export const SongCreateScreen = ({ route, navigation }) => {
  const getRandomHexColor = () => {
    return (
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")
    );
  };
  const [color, setColor] = React.useState(getRandomHexColor());
  const complimentaryColor = getComplementaryColor(color);
  const createSong = useCreateSong();
  const [systemMessage, setSystemMessage] =
    React.useState(defaultSystemMessage);

  const onCreateSong = () => {
    createSong.mutate({
      prompt: color,
      system_message: systemMessage,
    });
  };

  React.useEffect(() => {
    if (createSong.isSuccess && navigation) {
      navigation.navigate("SongDetail", { songID: createSong?.data?.data });
    }
  }, [createSong.isSuccess]);

  return (
    <VStack flex={1} bg="white" shadow={3}>
      <Header />
      <VStack
        flex={1}
        bg={color}
        space={"md"}
        alignItems="center"
        justifyContent="center"
      >
        <HexColorPicker color={color} onChange={setColor} />

        <InstrumentList
          systemMessage={systemMessage}
          setSystemMessage={setSystemMessage}
        />

        <Button
          // logic
          onPress={onCreateSong}
          isLoading={createSong.isLoading}
          // styling
          shadow={1}
          size={"md"}
          zIndex={-100}
          minWidth={200}
          disabled={!prompt}
          borderColor={complimentaryColor}
          variant={"unstyled"}
          _hover={{
            shadow: 3,
          }}
          _spinner={{
            color: complimentaryColor,
          }}
          _text={{
            fontSize: "lg",
            color: complimentaryColor,
            fontWeight: "semibold",
          }}
        >
          Generate
        </Button>

        {createSong.isLoading && (
          <Text color={complimentaryColor}>
            This normally takes less than 60 seconds
          </Text>
        )}
      </VStack>

      <Footer />
    </VStack>
  );
};
