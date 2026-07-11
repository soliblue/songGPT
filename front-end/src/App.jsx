import React from "react";
import ABCJS from "abcjs";
import Select from "react-select";
import { HexColorPicker } from "react-colorful";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  CircleAlert,
  CheckCircle2,
  Download,
  ExternalLink,
  Github,
  LoaderCircle,
  MessageCircle,
  Music2,
  Palette,
  Settings,
  X,
} from "lucide-react";
import { createSong, getSong, listSongs, songFileURL } from "./api.js";
import { defaultSystemMessage } from "./data/defaultSystemMessage.js";
import { instruments } from "./data/instruments.js";

const palette = [
  "#F2A08C",
  "#B8D88C",
  "#C9B8E8",
  "#F3D27A",
  "#A9C9F5",
  "#E8A6B8",
  "#A7DCCB",
  "#F1B27B",
  "#B7CAE8",
  "#D8B7DB",
];

const placeholders = [
  "Slow Donkey...",
  "Very Fast Monkey...",
  "Deep Reflection...",
  "Joyful times...",
  "Sad times...",
  "Tadadadada...",
  "Winter is coming...",
  "The sun is shining...",
  "The rain is falling...",
  "The wind is blowing...",
];

const defaultInstruments = [
  { name: "Yamaha Grand Piano", channel: 0 },
  { name: "Electric Piano", channel: 2 },
  { name: "Violin", channel: 40 },
  { name: "Cello", channel: 42 },
  { name: "Harp", channel: 46 },
  { name: "Clarinet", channel: 71 },
  { name: "Alto Sax", channel: 65 },
  { name: "Oboe", channel: 68 },
  { name: "Flute", channel: 73 },
];

const generationSteps = ["Queued", "Composing", "Rendering", "Ready"];

const composerModels = [
  {
    value: "openai/gpt-5.6-sol",
    label: "Sol",
    title: "GPT-5.6 Sol with high reasoning",
  },
  {
    value: "anthropic/claude-opus-4-8",
    label: "Opus",
    title: "Claude Opus 4.8",
  },
];

const defaultComposerModel = composerModels[0].value;

const hashIndex = (value = "") =>
  [...value].reduce((total, char) => total + char.charCodeAt(0), 0) % palette.length;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const secondsSince = (date, now) => {
  const time = date ? new Date(date).getTime() : now;
  if (Number.isNaN(time)) return 0;
  return Math.max(0, Math.round((now - time) / 1000));
};

function useNow(active) {
  const [now, setNow] = React.useState(() => Date.now());

  React.useEffect(() => {
    if (!active) return undefined;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [active]);

  return now;
}

function progressForSong(song, now) {
  if (song.status === "failed") {
    return {
      title: "Generation stopped",
      subtitle: song.error || "The composer could not finish this one.",
      percent: 100,
      activeStep: -1,
      failed: true,
      meta: "Open the response bubble for details.",
    };
  }

  if (song.status === "processing") {
    const elapsed = secondsSince(
      song.processing_started_at || song.updated_at || song.created_at,
      now,
    );
    const percent = Math.round(clamp(42 + elapsed * 0.7, 42, 92));
    const rendering = elapsed > 35;
    return {
      title: rendering ? "Rendering MIDI" : "Composing your song",
      subtitle: rendering
        ? "ABC is being checked and turned into a MIDI file."
        : "The local CLI composer is writing ABC notation.",
      percent,
      activeStep: rendering ? 2 : 1,
      failed: false,
      meta: `${elapsed}s elapsed. This usually finishes in under a minute.`,
    };
  }

  const elapsed = secondsSince(song.created_at, now);
  return {
    title: "Waiting for composer",
    subtitle: "Your prompt is queued and the local composer will claim it shortly.",
    percent: Math.round(clamp(12 + elapsed * 0.55, 12, 38)),
    activeStep: 0,
    failed: false,
    meta: `${elapsed}s in queue. The daemon polls every few seconds.`,
  };
}

const getComplementaryColor = (hexColor) => {
  const color = hexColor.replace("#", "");
  const r = parseInt(color.slice(0, 2), 16);
  const g = parseInt(color.slice(2, 4), 16);
  const b = parseInt(color.slice(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "#000000" : "#ffffff";
};

const randomHexColor = () =>
  `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")}`;

const songBackground = (song) => {
  const hex = song?.prompt?.match(/#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/)?.[0];
  return hex || palette[hashIndex(song?.id)];
};

function App({ screen }) {
  return (
    <div className="app">
      <Header />
      {screen === "color" ? <ColorCreateScreen /> : null}
      {screen === "detail" ? <SongDetailScreen /> : null}
      {screen === "list" ? <SongListScreen /> : null}
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header>
      <div className="topbar">
        <div className="topbar-inner">
          <div className="brand-cluster">
            <Link to="/songs/" className="brand" aria-label="SongGPT home">
              <span className="brand-mark" />
              <span className="brand-name">SongGPT</span>
            </Link>
          </div>
          <a
            className="github-button"
            href="https://github.com/SoliMouse/songGPT"
            target="_blank"
            rel="noreferrer"
          >
            <Github size={18} />
            <span>Star on GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <p>
        Made with love by{" "}
        <a href="https://twitter.com/_xSoli" target="_blank" rel="noreferrer">
          Soli
        </a>
      </p>
    </footer>
  );
}

function SongListScreen() {
  const songs = useQuery({
    queryKey: ["songs"],
    queryFn: () => listSongs({ limit: 6 }),
  });

  return (
    <main className="screen">
      <section className="song-rail" aria-label="Generated examples">
        {songs.isLoading ? <SongSkeletons /> : null}
        {songs.data?.songs?.length ? (
          <div className="rail-scroll">
            {songs.data.songs.map((song) => (
              <SongCard key={song.id} song={song} compact />
            ))}
          </div>
        ) : null}
        {!songs.isLoading && !songs.data?.songs?.length ? (
          <p className="empty-state">Generated songs will appear here.</p>
        ) : null}
      </section>
      <SongCreate />
    </main>
  );
}

function SongDetailScreen() {
  const { songID } = useParams();
  const song = useQuery({
    queryKey: ["song", songID],
    queryFn: () => getSong(songID),
    enabled: Boolean(songID),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "queued" || status === "processing" ? 3500 : false;
    },
  });
  const isGenerating =
    song.data?.status === "queued" || song.data?.status === "processing";

  return (
    <main className="screen detail-screen">
      <section className="detail-card-wrap">
        {song.isLoading ? <div className="detail-skeleton" /> : null}
        {song.data ? <SongCard song={song.data} /> : null}
      </section>
      {!isGenerating ? (
        <section className="detail-compose">
          <SongCreate initialSystemMessage={song.data?.system_message || defaultSystemMessage} />
          <Link className="examples-link" to="/songs/">
            See Examples
          </Link>
        </section>
      ) : null}
    </main>
  );
}

function ColorCreateScreen() {
  const [color, setColor] = React.useState(() => randomHexColor());
  const [systemMessage, setSystemMessage] = React.useState(defaultSystemMessage);
  const [model, setModel] = React.useState(defaultComposerModel);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const complementary = getComplementaryColor(color);
  const mutation = useMutation({
    mutationFn: createSong,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["songs"] });
      navigate(`/songs/${data.id}/`);
    },
  });

  return (
    <main className="color-screen" style={{ backgroundColor: color, color: complementary }}>
      <HexColorPicker color={color} onChange={setColor} />
      <InstrumentList systemMessage={systemMessage} setSystemMessage={setSystemMessage} />
      <ModelSelector
        value={model}
        onChange={setModel}
        style={{
          "--model-selector-color": complementary,
          "--model-selector-active-bg": complementary,
          "--model-selector-active-color": color,
        }}
      />
      <button
        className="generate-button color-generate"
        type="button"
        disabled={mutation.isPending}
        onClick={() =>
          mutation.mutate({
            prompt: `Color (hexcode): ${color}`,
            system_message: systemMessage,
            model,
          })
        }
        style={{ color: complementary, borderColor: complementary }}
      >
        {mutation.isPending ? "Generating..." : "Generate"}
      </button>
      {mutation.isPending ? (
        <p className="loading-note" style={{ color: complementary }}>
          This normally takes less than 60 seconds
        </p>
      ) : null}
      {mutation.error ? <p className="error-note">{mutation.error.message}</p> : null}
    </main>
  );
}

function SongCreate({ initialSystemMessage = defaultSystemMessage }) {
  const [prompt, setPrompt] = React.useState("");
  const [systemMessage, setSystemMessage] = React.useState(initialSystemMessage);
  const [model, setModel] = React.useState(defaultComposerModel);
  const placeholder = React.useMemo(
    () => placeholders[Math.floor(Math.random() * placeholders.length)],
    [],
  );
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createSong,
    onSuccess: (data) => {
      setPrompt("");
      queryClient.invalidateQueries({ queryKey: ["songs"] });
      navigate(`/songs/${data.id}/`);
    },
  });

  return (
    <section className="composer" aria-label="Create a song">
      <InstrumentList systemMessage={systemMessage} setSystemMessage={setSystemMessage} />
      <ModelSelector value={model} onChange={setModel} />
      <div className="prompt-shell">
        <SettingsModal systemMessage={systemMessage} setSystemMessage={setSystemMessage} />
        <textarea
          value={prompt}
          maxLength={1000}
          rows={1}
          placeholder={placeholder}
          onChange={(event) => setPrompt(event.target.value)}
          aria-label="Song prompt"
        />
        <Link className="palette-button" to="/songs/create/" aria-label="Create from color">
          <Palette size={20} />
        </Link>
      </div>
      <p className="hint">
        Paste your favorite quote or poem and let our language model generate a
        beautiful and original piece of music for you.
      </p>
      <button
        className="generate-button"
        type="button"
        disabled={!prompt || mutation.isPending}
        onClick={() => mutation.mutate({ prompt, system_message: systemMessage, model })}
      >
        {mutation.isPending ? "Queueing..." : "Generate"}
      </button>
      {mutation.isPending ? (
        <div className="submit-progress" role="status">
          <span />
          <p>Creating a composer job...</p>
        </div>
      ) : null}
      {mutation.error ? <p className="error-note">{mutation.error.message}</p> : null}
    </section>
  );
}

function ModelSelector({ value, onChange, style }) {
  return (
    <div
      className="model-selector"
      role="radiogroup"
      aria-label="Composition model"
      style={style}
    >
      {composerModels.map((model) => {
        const selected = model.value === value;
        return (
          <button
            key={model.value}
            type="button"
            role="radio"
            aria-checked={selected}
            className={selected ? "selected" : ""}
            title={model.title}
            onClick={() => onChange(model.value)}
          >
            {model.label}
          </button>
        );
      })}
    </div>
  );
}

function InstrumentList({ systemMessage, setSystemMessage }) {
  const [selectedInstruments, setSelectedInstruments] =
    React.useState(defaultInstruments);

  const options = React.useMemo(
    () =>
      instruments.map((instrument) => ({
        value: instrument.name,
        label: instrument.name,
        channel: instrument.channel,
      })),
    [],
  );

  React.useEffect(() => {
    const instrumentText = selectedInstruments
      .map((instrument) => `${instrument.name} (${instrument.channel})`)
      .join(", ");
    setSystemMessage(
      systemMessage.replace(/Instruments:[^.]*\./, `Instruments: ${instrumentText}.`),
    );
  }, [selectedInstruments]);

  return (
    <Select
      className="instrument-select"
      classNamePrefix="instrument"
      isMulti
      isClearable={false}
      options={options}
      value={selectedInstruments.map((instrument) => ({
        value: instrument.name,
        label: instrument.name,
        channel: instrument.channel,
      }))}
      onChange={(selected) => {
        if (selected?.length) {
          setSelectedInstruments(
            selected.map((option) => ({
              name: option.value,
              channel: option.channel,
            })),
          );
        }
      }}
      placeholder="Select instruments..."
      styles={{
        control: (base) => ({
          ...base,
          minWidth: 250,
          borderWidth: 0,
          boxShadow: "none",
          backgroundColor: "transparent",
        }),
        menu: (base) => ({
          ...base,
          zIndex: 20,
          padding: 5,
          opacity: 0.96,
          backdropFilter: "blur(25px)",
        }),
        multiValue: (base) => ({
          ...base,
          opacity: 0.58,
          backgroundColor: "#d5dee8",
        }),
        multiValueLabel: (base) => ({
          ...base,
          padding: 8,
          color: "#111827",
        }),
        multiValueRemove: (base) => ({
          ...base,
          cursor: "pointer",
          color: "#111827",
          ":hover": {
            color: "#111827",
            backgroundColor: "transparent",
          },
        }),
      }}
    />
  );
}

function SettingsModal({ systemMessage, setSystemMessage }) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <button
        className="prompt-icon"
        type="button"
        aria-label="Prompt settings"
        onClick={() => setOpen(true)}
      >
        <Settings size={18} />
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Prompt Engineering">
        <p className="modal-copy">
          We pass the prompt below to the composer before sending your input.
          We still haven't found the optimal prompt so feel free to modify this
          one and have some fun with it.
        </p>
        <textarea
          className="settings-textarea"
          rows={12}
          value={systemMessage}
          maxLength={2500}
          onChange={(event) => setSystemMessage(event.target.value)}
        />
        {systemMessage !== defaultSystemMessage ? (
          <button
            className="reset-button"
            type="button"
            onClick={() => setSystemMessage(defaultSystemMessage)}
          >
            Reset
          </button>
        ) : null}
      </Modal>
    </>
  );
}

function SongCard({ song, compact = false }) {
  const [responseOpen, setResponseOpen] = React.useState(false);
  const [downloadOpen, setDownloadOpen] = React.useState(false);
  const background = songBackground(song);
  const foreground = getComplementaryColor(background);
  const title = song?.abc?.match(/^T:\s*(.+)$/m)?.[1]?.trim() || "Untitled";
  const abc = song?.abc
    ?.replace(/^T:.*(?:\r?\n)?/gm, "")
    .replace(/(%%MIDI program)\s+\d+\s+(\d+)/g, "$1 $2");

  if (song.status !== "complete") {
    return (
      <section className="generation-panel" aria-label="Song generation progress">
        <SongStatus song={song} compact={compact} />
      </section>
    );
  }

  return (
    <article
      className={`song-card ${compact ? "compact" : ""}`}
      style={{ backgroundColor: background, color: foreground }}
    >
      <header className="song-card-header">
        <h2 title={title}>{title}</h2>
        <div className="song-actions">
          <Link
            className="song-icon"
            to={`/songs/${song.id}/`}
            style={{ color: foreground }}
            aria-label="Open song"
          >
            <ExternalLink size={20} />
          </Link>
          <div className="download-wrap">
            <button
              className="song-icon"
              type="button"
              style={{ color: foreground }}
              aria-label="Download song files"
              onClick={() => setDownloadOpen((value) => !value)}
            >
              <Download size={20} />
            </button>
            {downloadOpen ? <DownloadMenu songID={song.id} /> : null}
          </div>
          <button
            className="song-icon"
            type="button"
            style={{ color: foreground }}
            aria-label="Open composer response"
            onClick={() => setResponseOpen(true)}
          >
            <MessageCircle size={20} />
          </button>
        </div>
      </header>
      {abc ? <ABCAudioPlayer abc={abc} color={foreground} compact /> : null}
      <Modal
        open={responseOpen}
        onClose={() => setResponseOpen(false)}
        title="Composer response"
      >
        <pre className="response-text">
          {song.prompt}
          {"\n\n"}
          Model: {song.model || "unknown"}
          {"\n\n"}
          {song.response || song.abc || song.error || "No response yet."}
        </pre>
      </Modal>
    </article>
  );
}

function SongStatus({ song, compact = false }) {
  const now = useNow(song.status === "queued" || song.status === "processing");
  const progress = progressForSong(song, now);
  const StatusIcon = progress.failed
    ? CircleAlert
    : song.status === "processing"
      ? LoaderCircle
      : Music2;

  return (
    <div className={`song-status generation-progress ${progress.failed ? "failed" : ""}`}>
      <div className="progress-header">
        <span className="progress-icon" aria-hidden="true">
          <StatusIcon
            className={song.status === "processing" ? "spinning" : ""}
            size={compact ? 18 : 22}
          />
        </span>
        <div className="progress-copy">
          <strong>{progress.title}</strong>
          <span>{progress.subtitle}</span>
        </div>
        <span className="progress-percent">{progress.percent}%</span>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress.percent}
        aria-label={progress.title}
      >
        <span style={{ width: `${progress.percent}%` }} />
      </div>
      <ol className="progress-steps">
        {generationSteps.map((step, index) => {
          const done = !progress.failed && index < progress.activeStep;
          const active = !progress.failed && index === progress.activeStep;
          return (
            <li
              key={step}
              className={`${done ? "done" : ""} ${active ? "active" : ""}`}
            >
              <span>{done ? <CheckCircle2 size={12} /> : null}</span>
              {step}
            </li>
          );
        })}
      </ol>
      <p className="progress-meta">{progress.meta}</p>
    </div>
  );
}

function DownloadMenu({ songID }) {
  return (
    <div className="download-menu">
      <span>Download</span>
      <a href={songFileURL(songID, "abc")}>ABC</a>
      <a href={songFileURL(songID, "mid")}>MIDI</a>
    </div>
  );
}

function ABCAudioPlayer({ abc, color = "#ffffff", compact = false }) {
  const notationRef = React.useRef(null);
  const audioRef = React.useRef(null);

  React.useEffect(() => {
    if (!notationRef.current || !audioRef.current || !abc) return undefined;
    notationRef.current.innerHTML = "";
    audioRef.current.innerHTML = "";
    const visualObj = ABCJS.renderAbc(notationRef.current, abc, {
      staffwidth: 740,
      add_classes: true,
      responsive: "resize",
    });
    const synthController = new ABCJS.synth.SynthController();
    synthController.load(audioRef.current, null, {
      displayPlay: true,
      displayLoop: false,
      displayRestart: !compact,
      displayProgress: true,
      displayWarp: !compact,
    });
    const midiBuffer = new ABCJS.synth.CreateSynth();
    midiBuffer
      .init({ visualObj: visualObj[0] })
      .then(() => synthController.setTune(visualObj[0], false))
      .catch((error) => console.warn("Audio problem:", error));
    return () => {
      notationRef.current && (notationRef.current.innerHTML = "");
      audioRef.current && (audioRef.current.innerHTML = "");
    };
  }, [abc, compact]);

  return (
    <div
      className={`abc-player ${compact ? "compact-player" : ""} ${
        color !== "#ffffff" ? "inverse" : ""
      }`}
    >
      <div className="abcjs-scroll">
        <div ref={notationRef} className="abcjs-container" style={{ color }} />
      </div>
      <div className="abcjs-audio-shell">
        <div ref={audioRef} className="abcjs-audio" style={{ color }} />
      </div>
    </div>
  );
}

function Modal({ open, onClose, title, children }) {
  React.useEffect(() => {
    if (!open) return undefined;
    const handler = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="modal-header">
          <h2>{title}</h2>
          <button type="button" aria-label="Close" onClick={onClose}>
            <X size={20} />
          </button>
        </header>
        <div className="modal-body">{children}</div>
      </section>
    </div>
  );
}

function SongSkeletons() {
  return (
    <div className="rail-scroll">
      {[1, 2, 3, 4, 5].map((item) => (
        <div className="song-skeleton" key={item} />
      ))}
    </div>
  );
}

export default App;
