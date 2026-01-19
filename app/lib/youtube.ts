export async function searchYouTubeVideos(query: string): Promise<string[]> {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
        console.warn('YOUTUBE_API_KEY is not set');
        return [];
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=3&q=${encodeURIComponent(query + " レビュー")}&type=video&key=${apiKey}`;

        const response = await fetch(searchUrl, { signal: controller.signal });
        clearTimeout(timeoutId);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            return data.items.slice(0, 3).map((item: any) => item.id.videoId);
        }
        return [];
    } catch (error) {
        return [];
    }
}
