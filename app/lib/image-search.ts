export async function searchGoogleImages(query: string): Promise<string | null> {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const cx = process.env.GOOGLE_SEARCH_ENGINE_ID;

    if (!apiKey || !cx) {
        return null;
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        const searchQuery = `${query} site:amazon.co.jp`;
        const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(searchQuery)}&cx=${cx}&searchType=image&key=${apiKey}&num=1&safe=active`;

        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            return data.items[0].link;
        }
        return null;

    } catch (error) {
        return null;
    }
}
