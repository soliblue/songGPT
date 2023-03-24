import React from "react";
import Select from "react-select";
import { instruments } from "src/features/instruments/instruments";

export const InstrumentList = ({ systemMessage, setSystemMessage }) => {
  const [selectedInstruments, setSelectedInstruments] = React.useState(
    Array.from(instruments)
      .sort(() => Math.random() - 0.5)
      .slice(0, 5)
  );

  const options = instruments.map((instrument) => ({
    value: instrument.name,
    label: `${instrument.name}`,
    channel: instrument.channel,
  }));

  const customStyles = {
    control: (base, state) => ({
      ...base,
      minWidth: 250,
      backgroundColor: "transparent",
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
    label: `${instrument.name}`,
    channel: instrument.channel,
  }));

  return (
    <Select
      isMulti
      options={options}
      isClearable={false}
      styles={customStyles}
      value={selectedOptions}
      onChange={handleChange}
      placeholder="Select instruments..."
    />
  );
};
