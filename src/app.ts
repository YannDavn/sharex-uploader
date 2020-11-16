import express from "express";
import multer from "multer";
import bodyParser from "body-parser";

import indexRouter from "./routes/index";
import { HttpError } from "./helpers/error.helper";
import { config } from "./config";

var app = express();

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }));

app.use(
    (
        req: express.Request,
        _res: express.Response,
        next: express.NextFunction
    ) => {
        (req as any).Id = Math.random().toString(36).substr(2, 9);
        return next();
    }
);

app.use(
    "/",
    multer({ dest: config.uploadDir }).fields([{ name: "img" }]),
    indexRouter
);

// catch 404 and forward to error handler
app.use(function (_req, _res, next) {
    next(new HttpError("Not found", 404));
});

// error handler
app.use(function (
    err: Error | HttpError,
    _req: express.Request,
    res: express.Response
) {
    res.status((err as HttpError).status || 500);
    res.send({ err: err.message });
});

app.listen(config.port, () => {
    console.log(`Application listening on port ${config.port}`);
});
