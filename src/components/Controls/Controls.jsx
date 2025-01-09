import React, { useRef, useState, useEffect } from "react";
import { Icon } from "semantic-ui-react";

import useSound from "../../hooks/useSound";
import useAuth from "../../hooks/useAuth";

import "./controls.scss";

export const Controls = () => {
  const { sounds, deleteSound } = useSound();
  const { isPremium } = useAuth();

  const audioRefs = useRef({});
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [playingStates, setPlayingStates] = useState({});
  const [isLoopEnabled, setIsLoopEnabled] = useState(false);
  const [timer, setTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  useEffect(() => {
    const initialPlayingStates = {};
    sounds.forEach((sound) => {
      if (!audioRefs.current[sound.id]) {
        audioRefs.current[sound.id] = new Audio(sound.sound);
      }
      initialPlayingStates[sound.id] = false;
    });
    setPlayingStates(initialPlayingStates);

    return () => {
      Object.values(audioRefs.current).forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
      });
    };
  }, [sounds]);

  const togglePlayAll = () => {
    if (isPlayingAll) {
      stopAllSounds();
    } else {
      playAllSounds();
    }
    setIsPlayingAll(!isPlayingAll);
  };

  const playAllSounds = () => {
    Object.values(audioRefs.current).forEach((audio) => {
      audio.loop = isLoopEnabled;
      audio.play();
    });
    setPlayingStates((prev) =>
      Object.keys(prev).reduce((acc, id) => ({ ...acc, [id]: true }), {})
    );
  };

  const stopAllSounds = () => {
    Object.values(audioRefs.current).forEach((audio) => audio.pause());
    setPlayingStates((prev) =>
      Object.keys(prev).reduce((acc, id) => ({ ...acc, [id]: false }), {})
    );
  };

  const toggleIndividualPlay = (id) => {
    const currentAudio = audioRefs.current[id];

    setPlayingStates((prev) => {
      const newState = !prev[id];
      if (newState) {
        currentAudio.loop = isLoopEnabled;
        currentAudio.play();
      } else {
        currentAudio.pause();
      }
      return { ...prev, [id]: newState };
    });

    if (isPlayingAll) {
      setIsPlayingAll(false);
    }
  };

  const toggleLoop = () => {
    setIsLoopEnabled((prev) => !prev);
  };

  const handleVolumeChange = (id, volume) => {
    const currentAudio = audioRefs.current[id];
    if (currentAudio) {
      currentAudio.volume = volume / 100;
    }
  };

  const startTimer = () => {
    if (!timer || timer <= 0) return;

    setIsTimerActive(true);
    setTimeLeft(timer * 60);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsTimerActive(false);
          stopAllSounds();
          setIsPlayingAll(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="container-controls">
      {isPremium && (
        <>
          <div className="container-controls__content__premium-buttons">
            <button onClick={togglePlayAll} className="play-all-button">
              <Icon name={isPlayingAll ? "pause circle" : "play circle"} />
              {isPlayingAll ? "Pausar Todos" : "Reproducir Todos"}
            </button>
            <button onClick={toggleLoop} className="loop-button">
              <Icon name={isLoopEnabled ? "ban" : "sync"} />
              {isLoopEnabled ? "Desactivar Loop" : "Activar Loop"}
            </button>
          </div>
          <div className="container-controls__content__timer">
            <input
              type="number"
              min="1"
              placeholder="minutos"
              value={timer || ""}
              onChange={(e) => setTimer(Number(e.target.value))}
              disabled={isTimerActive}
            />
            <button onClick={startTimer} disabled={isTimerActive}>
              <Icon name={isTimerActive ? "pause" : "play"} />
            </button>
            {isTimerActive && (
              <p>
                Tiempo restante: {Math.floor(timeLeft / 60)}:
                {timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}
              </p>
            )}
          </div>
        </>
      )}
      {sounds.map((sound) => (
        <div key={sound.id}>
          <div className="container-controls__content__title">
            <button onClick={() => toggleIndividualPlay(sound.id)}>
              {playingStates[sound.id] ? (
                <Icon name="pause" />
              ) : (
                <Icon name="play" />
              )}
            </button>
            <p>{sound.title}</p>
          </div>
          <div className="container-controls__content__audio">
            <input
              type="range"
              min={0}
              max={100}
              defaultValue={50}
              className="range"
              onChange={(e) => handleVolumeChange(sound.id, e.target.value)}
            />
            <button
              onClick={() => deleteSound(sound.id)}
              className="delete-button"
            >
              <Icon name="trash" />
            </button>
          </div>
          <br />
        </div>
      ))}
    </div>
  );
};
