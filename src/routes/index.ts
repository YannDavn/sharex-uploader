import express from "express";
import { config } from "../config";
import * as fs from "fs/promises";
import { uploadFile } from "../controllers/files.controller";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const link = await uploadFile(req.files);
    return res.json({ link });
  } catch (err) {
    next(err);
  }
});

router.get("/:name", async (req, res, _next) => {
  const folder = req.params.name.split(".")[0];
  try {
    await fs.stat(`${config.uploadDir}/${folder}`);
  } catch (err) {
    return res.status(404).send();
  }
  const fileName = `uploads/${folder}/${req.params.name}`;
  if (req.query.download) {
    return res.download(fileName);
  }
  const fileContent = await fs.readFile(fileName);
  return res.end(fileContent);
});

export default router;
