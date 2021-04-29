import express from "express";
import { clearOldFiles, uploadFile } from "../controllers/files.controller";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    // D'abord, on supprime les fichiers trop "anciens"
    await clearOldFiles();
    // Et enfin on enregistre le fichier
    const link = await uploadFile(req.files);
    return res.json({ link });
  } catch (err) {
    next(err);
  }
});

export default router;
