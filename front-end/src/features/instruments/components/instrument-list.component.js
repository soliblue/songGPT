import React from "react";
import Select from "react-select";
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
    <Select
      isMulti
      options={options}
      value={selectedOptions}
      onChange={handleChange}
      placeholder="Select instruments..."
    />
  );
};
