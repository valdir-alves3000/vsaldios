import { fetchVideoInfo } from "./fetchVideo.js";
import { View } from "./view.js";

function isYouTubeUrl(url) {
  let youtubeRegex =
    /^(https?:\/\/)?(www\.)?(youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

  return youtubeRegex.test(url);
}

async function handleUrlInput(event) {
  const view = new View();
  if (!isYouTubeUrl(event.target.value)) {
    return;
  }

  view.hiddenFeedback();
  view.showLoading();
  view.hiddenDownloadSelectedFile();
  view.removeDownloadLinks();
  try {
    const { iframeUrl, formats, description } = await fetchVideoInfo(
      event.target.value
    );

    view.updatePreviewArea(iframeUrl, formats, description);
  } catch (error) {
    view.showFeedback();
  } finally {
    view.hiddenLoading();
  }
}

export { handleUrlInput };
