const youtubeIdPattern = /^[A-Za-z0-9_-]{6,}$/;

export const extractYouTubeVideoId = (value?: string | null) => {
  const trimmed = value?.trim();
  if (!trimmed) return null;

  try {
    const url = new URL(trimmed);
    const hostname = url.hostname.replace(/^www\./, '').toLowerCase();

    if (hostname === 'youtu.be') {
      const videoId = url.pathname.split('/').filter(Boolean)[0];
      return videoId && youtubeIdPattern.test(videoId) ? videoId : null;
    }

    if (hostname === 'youtube.com' || hostname === 'm.youtube.com') {
      const pathParts = url.pathname.split('/').filter(Boolean);
      const videoId =
        url.pathname === '/watch'
          ? url.searchParams.get('v')
          : pathParts[0] === 'shorts' || pathParts[0] === 'embed'
            ? pathParts[1]
            : null;

      return videoId && youtubeIdPattern.test(videoId) ? videoId : null;
    }
  } catch {
    return null;
  }

  return null;
};

export const toYouTubeEmbedUrl = (value?: string | null) => {
  const videoId = extractYouTubeVideoId(value);
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
};
