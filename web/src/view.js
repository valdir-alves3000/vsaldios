export class View {
  #previewArea = document.querySelector(".preview-area");
  #thumbnail = document.querySelector(".thumbnail");
  #details = document.querySelector(".details");
  #audios = document.querySelector(".details .audios");
  #videos = document.querySelector(".details .videos");
  #description = document.querySelector(".description");
  #urlField = document.querySelector(".field input");
  #baseURL = "https://vsaldios.onrender.com";

  updatePreviewArea(iframeUrl, formats, description) {
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

  #calculateFileSize(bitrate, approxDurationMs) {
    const sizeInMB = (
      (bitrate * approxDurationMs) /
      8 /
      1024 /
      1024 /
      1000
    ).toFixed(2);

    return `${sizeInMB} MB`;
  }

  #createDownloadIcon() {
    const iconDownload = document.createElement("i");
    iconDownload.classList.add("fa-solid", "fa-download");

    return iconDownload;
  }

  #createDownloadLink(format) {
    const link = document.createElement("a");

    const sizeFile = this.#calculateFileSize(
      format.bitrate,
      format.approxDurationMs
    );
    const bitrate = `${Math.ceil(format.bitrate / 1000)} kbps`;

    link.href = `${this.#baseURL}/download?url=${this.#urlField.value}&format=${
      format.indexFormat
    }`;
    link.appendChild(this.#createSpanElement(format.container.toUpperCase()));
    link.appendChild(this.#createSpanElement(format.qualityLabel || bitrate));
    link.appendChild(this.#createSpanElement(sizeFile));
    link.appendChild(this.#createDownloadIcon());

    return link;
  }

  #createListItem(format) {
    const link = this.#createDownloadLink(format);
    const li = document.createElement("li");
    li.appendChild(link);
    return li;
  }

  #removeDownloadLinks() {
    const downloadLinks = this.#details.querySelectorAll("ul");
    downloadLinks.forEach((ul) => (ul.innerHTML = ""));
  }

  #createElementFormatVideo(format) {
    const li = this.#createListItem(format);
    li.addEventListener("click", () => {
      this.#removeDownloadLinks();
      this.#urlField.value = "";
    });

    return li;
  }
}
