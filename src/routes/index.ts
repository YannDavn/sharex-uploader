import express from "express";
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

export default router;
