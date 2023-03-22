import React from "react";
import Select from "react-select";
import { VStack, Text } from "native-base";
import { instruments } from "src/features/instruments/instruments";

export const InstrumentList = ({ systemMessage, setSystemMessage }) => {
  const [selectedInstruments, setSelectedInstruments] = React.useState([
    { name: "Alto Sax", channel: 65 },
  ]);

  const options = instruments.map((instrument) => ({
    value: instrument.name,
    label: `${instrument.name} (${instrument.channel})`,
    channel: instrument.channel,
  }));

  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderWidth: 0,
      boxShadow: state.isFocused ? 0 : 0,
      borderColor: "transparent",
      "&:hover": {
        borderColor: "transparent",
      },
    }),
    menu: (base) => ({
      ...base,
      zIndex: 10000, // High zIndex to ensure it appears above other elements
      position: "absolute",
      backgroundColor: "white", // Set the background color to white
    }),
  };

  const handleChange = (selected) => {
    if (selected && selected.length > 0) {
      setSelectedInstruments(
        selected.map((option) => ({
          name: option.value,
          channel: option.channel,
        }))
      );
    }
  };

  React.useEffect(() => {
    const instrumentText = selectedInstruments
      .map((instrument) => `${instrument.name} (${instrument.channel})`)
      .join(", ");
    const updatedSystemMessage = systemMessage.replace(
      /Use these instruments:[^.]*\./,
      `Use these instruments: ${instrumentText}.`
    );

    setSystemMessage(updatedSystemMessage);
  }, [selectedInstruments]);

  const selectedOptions = selectedInstruments.map((instrument) => ({
    value: instrument.name,
    label: `${instrument.name} (${instrument.channel})`,
    channel: instrument.channel,
  }));

  return (
    <VStack px={3} space={"xs"} zIndex={10000}>
      <Text fontWeight={"semibold"}>Select your instruments:</Text>
      <Select
        isMulti
        options={options}
        isClearable={false}
        styles={customStyles}
        value={selectedOptions}
        onChange={handleChange}
        placeholder="Select instruments..."
      />
    </VStack>
  );
};
