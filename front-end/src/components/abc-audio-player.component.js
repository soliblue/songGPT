import React from "react";
import ABCJS from "abcjs";
import "./abc-audio-player.css";
import { ScrollView, VStack } from "native-base";

const ABCAudioPlayer = ({ abc, color = "white" }) => {
  const notationDiv = React.useRef(null);
  const audioControlsDiv = React.useRef(null);

  React.useEffect(() => {
    const visualObj = ABCJS.renderAbc(notationDiv.current, abc, {
      staffwidth: 740,
      add_classes: true,
      responsive: "resize",
    });

    const synthController = new ABCJS.synth.SynthController();
    synthController.load(audioControlsDiv.current, null, {
      displayPlay: true,
      displayLoop: false,
      displayRestart: false,
      displayProgress: true,
      displayWarp: true,
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

  const notesStyle = {
    width: "100%",
    overflowX: "auto",
    color: color,
    fill: color,
    stroke: color,
  };

  return (
    <VStack space={3}>
      <ScrollView
        height={150}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <div
          ref={notationDiv}
          style={notesStyle}
          className="abcjs-container"
        ></div>
      </ScrollView>

      <div
        ref={audioControlsDiv}
        style={notesStyle}
        className={color !== "#FFFFFF" ? "inverse" : undefined}
      ></div>
    </VStack>
  );
};

export default ABCAudioPlayer;
