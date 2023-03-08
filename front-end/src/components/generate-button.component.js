import React from "react";
import { Button } from "native-base";

export const GenerateButton = () => (
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
);
