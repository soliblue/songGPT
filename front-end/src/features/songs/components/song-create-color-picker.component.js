import React, { useState } from "react";
import { SliderPicker, SliderPickerProps } from "react-color";

export const SongCreateColorPicker = ({ onColorChange }) => {
  const [selectedColor, setSelectedColor] = useState("#ffffff");

  const handleChangeComplete = (color) => {
    setSelectedColor(color.hex);
    if (onColorChange) {
      onColorChange(color.hex);
    }
  };

  return (
    <SliderPicker
      color={selectedColor}
      onChangeComplete={handleChangeComplete}
    />
  );
};
