import { fetchVideoDownload } from "./fetchVideo.js";

export class View {
  #previewArea = document.querySelector(".preview-area");
  #thumbnail = document.querySelector(".thumbnail");
  #details = document.querySelector(".details");
  #audios = document.querySelector(".details .audios");
  #videos = document.querySelector(".details .videos");
  #description = document.querySelector(".description");
  #urlField = document.querySelector(".field input");
  #loading = document.querySelector(".loading-container");
  #feedback = document.querySelector(".feedback");
  #downloadLink = document.querySelector(".download-link");

  updatePreviewArea(iframeUrl, formats, description) {
    if (!iframeUrl) return this.showFeedback();

    this.#previewArea.classList.add("active");
    this.#details.classList.add("active");
    this.#description.textContent = description;

    this.#createElementDetails(iframeUrl, formats);
  }

  #displayAudioDownloadLinks(audios) {
    this.#audios.innerHTML =
      "<h3><i class='fa-solid fa-music'></i>Links para download do audio</h3>";

    audios.forEach((audio) =>
      this.#audios.appendChild(this.#createElementFormatVideo(audio))
    );
  }

  #displayVideoDownloadLinks(videos) {
    this.#videos.innerHTML =
      "<h3><i class='fa-brands fa-youtube'></i>Links para download do video</h3>";
    videos.forEach((video) =>
      this.#videos.appendChild(this.#createElementFormatVideo(video))
    );
  }

  #createElementDetails(iframeUrl, formats) {
    this.#thumbnail.src = iframeUrl;

    if (formats.audios) this.#displayAudioDownloadLinks(formats.audios);

    if (formats.videos) this.#displayVideoDownloadLinks(formats.videos);
  }

  #createSpanElement(text) {
    const span = document.createElement("span");
    span.textContent = text;
    return span;
  }

  #sizeToMB(size) {
    return `${(size / 1024 / 1024).toFixed(2)} MB`;
  }

  #createDownloadIcon() {
    const iconDownload = document.createElement("i");
    iconDownload.classList.add("fa-solid", "fa-download");

    return iconDownload;
  }

  #createDownloadDiv(format) {
    const div = document.createElement("div");

    div.appendChild(this.#createSpanElement(format.mimeType.toUpperCase()));
    div.appendChild(this.#createSpanElement(format.qualityLabel));
    div.appendChild(this.#createSpanElement(this.#sizeToMB(format.size)));
    div.appendChild(this.#createDownloadIcon());

    return div;
  }

  #createListItem(format, url) {
    const div = this.#createDownloadDiv(format);
    const li = document.createElement("li");
    li.appendChild(div);
    return li;
  }

  #createElementFormatVideo(format) {
    const url = this.#urlField.value;
    const li = this.#createListItem(format, this.#urlField.value);
    li.addEventListener("click", async () => {
      this.#clearDetails();
      const { filename } = await fetchVideoDownload(url, format.formatID);
      if (filename) {
        this.hiddenLoading();
        this.#showDownloadSelectedFile(filename);
      }
    });

    return li;
  }

  #clearDetails() {
    this.removeDownloadLinks();
    this.#urlField.value = "";
    this.showLoading();
  }

  showLoading() {
    this.#loading.style.display = "flex";
  }
  hiddenLoading() {
    this.#loading.style.display = "none";
  }

  showFeedback() {
    this.#feedback.style.display = "block";
  }

  hiddenFeedback() {
    this.#feedback.style.display = "none";
  }

  hiddenDownloadSelectedFile() {
    this.#downloadLink.style.display = "none";
  }

  #showDownloadSelectedFile(filename) {
    const href = `/video?filename=${filename}`;
    this.#downloadLink.setAttribute("href", href);
    this.#downloadLink.style.display = "flex";
    this.#downloadLink.addEventListener("click", () =>
      setTimeout(() => {
        this.hiddenDownloadSelectedFile();
      }, 100)
    );
  }

  removeDownloadLinks() {
    const downloadLinks = this.#details.querySelectorAll("ul");
    downloadLinks.forEach((ul) => (ul.innerHTML = ""));
  }
}
