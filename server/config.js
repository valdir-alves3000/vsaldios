import path from "path";

const dirname = new URL(import.meta.url).pathname;
const FOLDER = path.join(dirname, "..", "file");

export { FOLDER };
