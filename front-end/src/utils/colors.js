export const getComplementaryColor = (hexColor) => {
  const color = hexColor.slice(1); // remove the hash symbol from the string
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000; // YIQ color model for brightness
  return yiq >= 128 ? "#000000" : "#FFFFFF"; // return black or white based on brightness
};

export const getRandomHexColor = () => {
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
  );
};
