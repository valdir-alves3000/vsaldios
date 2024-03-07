export async function fetchVideoInfo(url) {
  try {
    const response = await fetch(`/info?url=${url}`);

    if (!response.ok) {
      console.error({ error: "Failed to fetch video information" });
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching video information:", error);
  }
}
