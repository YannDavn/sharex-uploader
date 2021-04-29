import * as fs from "mz/fs";
import { config } from "../config";
import { join } from "path";

const generateId = () => Math.random().toString(36).substr(2, 9);

const generateSafeId = async () => {
  while (true) {
    const id = generateId();
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

    // On renomme le fichier : [identifiant].[extension originale]
    const fileName = `${id}.${file.originalname.split(".").pop()}`;
    // Ensuite on renomme le fichier enregistré par Multer avec ce nouveau nom
    await fs.rename(
      `${config.uploadDir}/${file.filename}`,
      `${config.uploadDir}/${fileName}`
    );
    // Et on retourne l'URL de téléchargement
    return `${config.url}/${fileName}`;
  } catch (err) {
    // En cas d'erreur, on essaie de supprimer tout ce qui a été upload par l'utilisateur
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

/**
 * Parcourt l'entièreté du dossier "uploads" pour supprimer les fichiers "anciens"
 *
 */
export const clearOldFiles = async () => {
  // Récupération de la liste des noms de fichiers
  const allFiles = await fs.readdir(config.uploadDir);
  const d = Date.now();
  const deletionPromises: Array<Promise<void>> = [];
  for (const file of allFiles) {
    // Pour chaque fichier, on récupère sa date de création.
    const { birthtime } = await fs.stat(join(config.uploadDir, file));
    if (d - birthtime.getTime() > config.maxAge) {
      // Si il a été créé il y a plus longtemps que définit en config, on le rajoute à la liste des fichiers à supprimer
      deletionPromises.push(fs.unlink(join(config.uploadDir, file)))
    }
  }
  // Et on supprime tous les fichiers destinés à la suppression
  await Promise.all(deletionPromises);
};
