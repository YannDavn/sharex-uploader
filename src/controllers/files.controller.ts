import * as fs from "mz/fs";
import { config } from "../config";

const generateId = () => Math.random().toString(36).substr(2, 9)

const generateSafeId = async () => {
  while (true) {
    const id = generateId()
    try {
      await fs.stat(`uploads/${id}`);
    } catch (err) {
      // fs.stat renvoie une erreur si le dossier n'existe pas. On a donc un id safe ici
      return id;
    }
  }
};

/**
 * Enregistre un fichier
 *
 * @param {Array<any>} files Liste des fichiers
 * @returns {Promise<string>} Chemin complet du fichier enregistré
 */
export const uploadFile = async (files: any): Promise<string> => {
  try {
    // On ne gère l'envoi que d'un fichier, on récupère donc le premier (enregistré sous la clé "img")
    const file: Express.Multer.File = files?.img?.[0];
    if (!file) {
      throw new Error("Invalid file quantity");
    }
    // On génère un identifiant unique pour ce fichier
    const id = await generateSafeId();

    // Et ensuite on crée toute l'arborescence : D'abord le dossier
    await fs.mkdir(`${config.uploadDir}/${id}`, { recursive: true });
    const fileName = `${id}.${file.originalname.split(".").pop()}`;
    // Ensuite on y déplace le fichier enregistré par Multer
    await fs.rename(
      `${config.uploadDir}/${file.filename}`,
      `${config.uploadDir}/${id}/${fileName}`
    );
    // Et on retourne l'URL de téléchargement
    return `${config.url}/${fileName}`;
  } catch (err) {
    if (files) {
      try {
        for (const k of Object.keys(files)) {
          for (const f of files[k]) {
            await fs.unlink(`${config.uploadDir}/${f.filename}`);
          }
        }
      } catch (_err) {}
    }
    throw err;
  }
};
