import React from "react";
import { HStack, VStack } from "native-base";
// internal components
import { Footer } from "../components/footer.component";
import { Header } from "../components/header.component";
import { InputBar } from "../components/input-bar.component";
import { GenerateButton } from "../components/generate-button.component";

export const HomeScreen = () => {
  return (
    <VStack flex={1} bg="white">
      <Header />
      <HStack flex={1} justifyContent="center">
        <VStack
          flex={1}
          maxW={992}
          space={"lg"}
          alignItems={"center"}
          justifyContent="center"
        >
          <InputBar />
          <GenerateButton />
        </VStack>
      </HStack>
      <Footer />
    </VStack>
  );
};
