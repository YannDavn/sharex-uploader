import express from "express";
import mz from "mz";
const fs = mz.fs;

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
        await fs.mkdir(`uploads/${id}`);
        const fileName = `${id}.${file.originalname.split(".").pop()}`;
        await fs.rename(
            `uploads/${file.filename}`,
            `uploads/${id}/${fileName}`
        );
        await fs.writeFile(`uploads/${id}/meta`, JSON.stringify(file), {
            flag: "a",
        });
        return res.json({ link: `https://i.ydav.in/${fileName}` });
    } catch (err) {
        if (req.files) {
            try {
                for (const k of Object.keys(req.files)) {
                    for (const f of (req.files as any)[k]) {
                        await fs.unlink(`uploads/${f.filename}`);
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
        await fs.stat(`uploads/${folder}`);
    } catch (err) {
        return res.status(404).send();
    }
    const meta = JSON.parse(
        await fs.readFile(`uploads/${folder}/meta`, { encoding: "utf8" })
    );
    res.writeHead(200, {
        "Content-Type": meta.mimetype,
        "Content-Disposition":
            "atachment; filename=" +
            folder +
            "." +
            meta.originalname.split(".").pop(),
    });
    fs.createReadStream(`uploads/${folder}/${req.params.name}`).pipe(res);
});

export default router;
