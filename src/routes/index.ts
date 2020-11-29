import express from "express";
import { config } from "../config";
import * as fs from "fs/promises";

const router = express.Router();

router.post("/", async (req, res, next) => {
    try {
        let id = (req as any).Id;
        const file: Express.Multer.File = (req.files as any)?.img?.[0];
        if (!file) {
            throw new Error("Invalid file quantity");
        }
        let available = false;
        while (!available) {
            try {
                const r = await fs.stat(`uploads/${id}`);
                console.log(r);
                id = Math.random().toString(36).substr(2, 9);
            } catch (err) {
                break;
            }
        }
        await fs.mkdir(`${config.uploadDir}/${id}`, { recursive: true });
        const fileName = `${id}.${file.originalname.split(".").pop()}`;
        await fs.rename(
            `${config.uploadDir}/${file.filename}`,
            `${config.uploadDir}/${id}/${fileName}`
        );
        return res.json({ link: `${config.url}/${fileName}` });
    } catch (err) {
        if (req.files) {
            try {
                for (const k of Object.keys(req.files)) {
                    for (const f of (req.files as any)[k]) {
                        await fs.unlink(`${config.uploadDir}/${f.filename}`);
                    }
                }
            } catch (_err) {}
        }
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
