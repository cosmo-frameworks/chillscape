import { openDB } from "idb";

const DB_NAME = "soundDatabase";
const STORE_NAME = "sounds";

// Configura y abre la base de datos
export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    },
  });
};

// Guardar un sonido
export const addSoundToDB = async (sound) => {
  const db = await initDB();
  await db.put(STORE_NAME, sound);
};

// Obtener todos los sonidos
export const getSoundsFromDB = async () => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};

// Eliminar un sonido
export const deleteSoundFromDB = async (id) => {
  const db = await initDB();
  await db.delete(STORE_NAME, id);
};
