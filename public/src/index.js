import { handleUrlInput } from "./handleUrlInput.js";

const urlField = document.querySelector(".field input");
urlField.addEventListener("input", (event) => handleUrlInput(event));
