async function fetchVideoInfo(url) {
  try {
    const response = await fetch(`/info?url=${url}`);

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching video information:", error);
  }
}

async function fetchVideoDownload(url, formatID) {
  try {
    const response = await fetch(`/download?url=${url}&format=${formatID}`);
    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
  }
}

export { fetchVideoDownload, fetchVideoInfo };
