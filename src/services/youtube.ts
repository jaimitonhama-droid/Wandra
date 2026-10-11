export async function getPlaylistVideos(playlistId: string) {
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  if (!apiKey) {
    console.error("YouTube API key is missing");
    return [];
  }

  try {
    // 1. Fetch playlist items
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${playlistId}&key=${apiKey}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      console.error("YouTube API error", await response.text());
      return [];
    }

    const data = await response.json();
    if (!data.items || data.items.length === 0) return [];

    const videoIds = data.items.map((item: any) => item.contentDetails.videoId);

    // 2. Fetch video details for durations
    const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds.join(",")}&key=${apiKey}`;
    const videosResponse = await fetch(videosUrl);
    const videosData = videosResponse.ok ? await videosResponse.json() : { items: [] };

    const durationMap: Record<string, string> = {};
    videosData.items?.forEach((v: any) => {
      durationMap[v.id] = v.contentDetails.duration || "PT0S";
    });

    const formatDuration = (isoStr: string) => {
      const match = isoStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
      if (!match) return "Vídeo";
      const h = parseInt(match[1] || "0");
      const m = parseInt(match[2] || "0");
      const s = parseInt(match[3] || "0");
      
      if (h > 0) {
        return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')} h`;
      }
      return `${m}:${s.toString().padStart(2, '0')} min`;
    };

    return data.items
      .filter((item: any) => item.snippet.title !== "Private video" && item.snippet.title !== "Deleted video")
      .map((item: any) => {
        const vidId = item.contentDetails.videoId;
        return {
          id: vidId,
          youtubeId: vidId,
          titulo: item.snippet.title,
          descricao: item.snippet.description,
          duracao: formatDuration(durationMap[vidId] || "PT0S"),
        };
      });
  } catch (error) {
    console.error("Error fetching YouTube playlist:", error);
    return [];
  }
}
