export const themeConfig = () => {
  return {
    useSystemColorMode: true,
    initialColorMode: "light",
    colors: {
      primary: {
        50: "#fefefe",
        100: "#fdfdfe",
        200: "#fcfcfd",
        300: "#fafbfc",
        400: "#f9fafb",
        500: "#f8f9fa",
        600: "#f7f8f9",
        700: "#f6f7f9",
        800: "#f5f6f8",
        900: "#f3f5f6",
      },
    },
    fontConfig: {
      Recursive: {
        300: {
          normal: "Recursive_300Light",
        },
        400: {
          normal: "Recursive_400Regular",
        },
        500: {
          normal: "Recursive_500Medium",
        },
        600: {
          normal: "Recursive_600SemiBold",
        },
        700: {
          normal: "Recursive_700Bold",
        },
        800: {
          normal: "Recursive_800ExtraBold",
        },
        900: {
          normal: "Recursive_900Black",
        },
      },
    },
    fonts: {
      heading: "Recursive",
      body: "Recursive",
      mono: "Recursive",
    },
  };
};
