import React from "react";
import Abcjs from "react-abcjs";

export const SongDetailMusicSheet = ({ abc }) => (
  <Abcjs
    abcNotation={abc}
    parserParams={{}}
    engraverParams={{ responsive: "resize" }}
    renderParams={{ viewportHorizontal: true }}
  />
);
