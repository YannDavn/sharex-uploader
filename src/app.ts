import express from "express";
import multer from "multer";
import bodyParser from "body-parser";

import indexRouter from "./routes/index";
import { HttpError } from "./helpers/error.helper";
import { config } from "./config";
import { join } from "path";

var app = express();

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }));

app.use(
  "/",
  multer({ dest: config.uploadDir }).fields([{ name: "img" }]),
  indexRouter
);

app.use(express.static(join(process.cwd(), "uploads")));

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
  console.error(err);
  res.status((err as HttpError).status || 500);
  res.send({});
});

app.listen(config.port, () => {
  console.log(`Application listening on port ${config.port}`);
});
