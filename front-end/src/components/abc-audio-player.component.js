import React, { useEffect, useRef } from "react";
import ABCJS from "abcjs";
import "./abc-audio-player.css";
import { ScrollView } from "native-base";

const ABCAudioPlayer = ({ abc }) => {
  const notationDiv = useRef(null);
  const audioControlsDiv = useRef(null);

  useEffect(() => {
    const visualObj = ABCJS.renderAbc(notationDiv.current, abc, {
      responsive: "resize",
    });

    const synthController = new ABCJS.synth.SynthController();
    synthController.load(audioControlsDiv.current, null, {
      displayLoop: false,
      displayRestart: false,
      displayPlay: true,
      displayProgress: true,
      displayWarp: false,
    });

    function setTune() {
      synthController.disable(true);
      const midiBuffer = new ABCJS.synth.CreateSynth();
      midiBuffer
        .init({ visualObj: visualObj[0] })
        .then(() => synthController.setTune(visualObj[0], false))
        .catch((error) => console.warn("Audio problem:", error));
    }

    setTune();
  }, [abc]);

  return (
    <div>
      <ScrollView
        height={150}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <div
          ref={notationDiv}
          className="abcjs-container"
          style={{ width: "100%", overflowX: "auto" }}
        ></div>
      </ScrollView>

      <div ref={audioControlsDiv}></div>
    </div>
  );
};

export default ABCAudioPlayer;
