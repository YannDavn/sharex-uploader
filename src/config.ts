import { readFileSync } from "fs";
import { join } from "path";

const defaultConfig = {
    url: "https://example.com",
    port: 4000,
    uploadDir: join(process.cwd(), "uploads"),
};

export const config: typeof defaultConfig = {
    ...defaultConfig,
    ...JSON.parse(
        readFileSync(join(process.cwd(), "config.json"), { encoding: "utf-8" })
    ),
};
