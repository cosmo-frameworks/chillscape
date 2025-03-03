import { useState } from "react";
import { toast } from "react-toastify";
import { Icon } from "semantic-ui-react";

import { PrimaryButton } from "../PrimaryButton";

import useSound from "../../hooks/useSound";
import useAuth from "../../hooks/useAuth";

import "./music.scss";

export const Music = () => {
  const { addSound, sounds } = useSound();
  const { isPremium } = useAuth();

  const [inputValue, setInputValue] = useState("");
  const [file, setFile] = useState(null);

  const handleInput = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile && selectedFile.type !== "audio/mpeg") {
      toast.error("Solo se permiten archivos MP3.");
      setFile(null);
    } else {
      setFile(selectedFile);
    }

    e.target.value = "";
  };

  const validations = () => {
    if (!file) {
      toast.warn("Selecciona un archivo de sonido.");
      return false;
    }

    if (!inputValue.trim()) {
      toast.warn("Introduce un título para el sonido.");
      return false;
    }

    if (sounds.length === 7 && !isPremium) {
      toast.info(
        "Has alcanzado el máximo de sonidos permitidos en la versión gratis."
      );
      setInputValue("");
      setFile(null);
      return false;
    }

    if (sounds.length === 14) {
      toast.info(
        "Has alcanzado el máximo de sonidos permitidos."
      );
      setInputValue("");
      setFile(null);
      return false;
    }

    return true;
  };

  const handleAddSound = async () => {
    if (!validations()) return;

    try {
      await addSound(file, inputValue);
      toast.success("Sonido añadido correctamente.");
      setInputValue("");
      setFile(null);
    } catch (error) {
      console.error("Error al añadir el sonido:", error);
      toast.error("Ocurrió un error al añadir el sonido.");
    }
  };

  return (
    <div className="container-spotify">
      <div className="container-spotify__title">
        <span>
          <p>
            Añade y escucha <br /> sonidos relajantes
          </p>
        </span>
      </div>

      <div className="container-spotify__content">
        <div id="FileUpload" className="container-upload">
          <input
            id="soundFile"
            type="file"
            accept="audio/mp3"
            onChange={handleInput}
          />
          <div className="container-upload__content">
            <span>
              {file === null ? (
                <Icon name="cloud upload" />
              ) : (
                <Icon name="file audio" />
              )}
            </span>
            {file === null ? (
              <p className="paragraph-def">
                Haz clic para seleccionar un archivo
              </p>
            ) : (
              <p className="paragraph-def">
                Archivo seleccionado: <b>{file.name}</b>
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="container-spotify__link">
        <input
          id="soundTitle"
          type="text"
          placeholder="Título del sonido"
          value={inputValue}
          className="paragraph-def"
          onChange={(e) => setInputValue(e.target.value)}
        />
        <div className="container-button-add">
          <PrimaryButton action={handleAddSound} text="Añadir" />
        </div>
      </div>
    </div>
  );
};
