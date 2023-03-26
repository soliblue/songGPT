import React from "react";
import Select from "react-select";
import { instruments } from "src/features/instruments/instruments";

export const InstrumentList = ({
  systemMessage,
  setSystemMessage,
  inputTextColor = "black",
  removeIconColor = "black",
  selectedLabelColor = "#D5DEE8",
  selectedLabelTextColor = "black",
}) => {
  const [selectedInstruments, setSelectedInstruments] = React.useState([
    { name: "Yamaha Grand Piano", channel: 0 },
    { name: "Electric Piano", channel: 2 },
    { name: "Violin", channel: 40 },
    { name: "Cello", channel: 42 },
    { name: "Harp", channel: 46 },
    { name: "Clarinet", channel: 71 },
    { name: "Alto Sax", channel: 65 },
    { name: "Oboe", channel: 68 },
    { name: "Flute", channel: 73 },
  ]);

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
      color: inputTextColor,
    }),
    menu: (base) => ({
      ...base,
      padding: 5,
      zIndex: 10000,
      backgroundColor: "white", // Set the menu background color with some transparency
      backdropFilter: "blur(25px)", // Add a blur effect to the menu
      opacity: 0.9, // Set the opacity of the menu
    }),
    multiValue: (base) => ({
      ...base,
      opacity: 0.5,
      backgroundColor: selectedLabelColor, // Set the background color of the selected labels with some transparency
    }),
    multiValueLabel: (base) => ({
      ...base,
      padding: 8,
      color: selectedLabelTextColor,
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: removeIconColor,
      cursor: "pointer",
      "&:hover": {
        color: removeIconColor,
        backgroundColor: "transparent",
      },
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
      /Instruments:[^.]*\./,
      `Instruments: ${instrumentText}.`
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
