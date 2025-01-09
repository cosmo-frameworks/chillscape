import React, { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

import { addSoundToDB, getSoundsFromDB, deleteSoundFromDB } from "../utils/db";

import rainSound from "../assets/sounds/rain.mp3";
import ambianceSounda from "../assets/sounds/night.mp3";
import streetSound from "../assets/sounds/street.mp3";
import fireplace from "../assets/sounds/fireplace.mp3";
import cricket from "../assets/sounds/cricket.mp3";

const SoundContext = createContext();

const defaultSounds = [
  { id: "1", sound: rainSound, title: "Rain" },
  { id: "2", sound: ambianceSounda, title: "Night ambiance" },
  { id: "3", sound: streetSound, title: "Street ambiance" },
  { id: "4", sound: fireplace, title: "Fireplace" },
  { id: "5", sound: cricket, title: "Crickets" },
];

const SoundProvider = ({ children }) => {
  const [sounds, setSounds] = useState([]);

  // Cargar sonidos desde IndexedDB o añadir sonidos por defecto
  useEffect(() => {
    const initializeSounds = async () => {
      const storedSounds = await getSoundsFromDB();

      if (storedSounds.length === 0) {
        // Si la base de datos está vacía, agrega los sonidos por defecto
        for (const sound of defaultSounds) {
          await addSoundToDB(sound);
        }
        setSounds(defaultSounds);
      } else {
        setSounds(storedSounds);
      }
    };

    initializeSounds();
  }, []);

  // Añadir un nuevo sonido
  const addSound = async (file, title) => {
    const validTypes = ["audio/mpeg"];

    if (!validTypes.includes(file.type)) {
      return alert("Seleccione un archivo válido de MP3.");
    }

    const fileToBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });

    try {
      const base64Sound = await fileToBase64(file);
      const newSound = {
        id: Date.now().toString(),
        sound: base64Sound,
        title,
      };

      await addSoundToDB(newSound);
      setSounds((prevSounds) => [...prevSounds, newSound]);
    } catch (error) {
      toast.error("Error al añadir el archivo de sonido.");
    }
  };

  // Eliminar un sonido
  const deleteSound = async (id) => {
    try {
      await deleteSoundFromDB(id);
      setSounds((prevSounds) => prevSounds.filter((sound) => sound.id !== id));
    } catch (error) {
      toast.error("Error al eliminar el sonido.");
    }
  };

  return (
    <SoundContext.Provider value={{ sounds, addSound, deleteSound }}>
      {children}
    </SoundContext.Provider>
  );
};

export { SoundProvider };

export default SoundContext;
