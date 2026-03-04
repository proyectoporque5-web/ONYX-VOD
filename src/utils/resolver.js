export const resolveMovieStream = async (tmdbId, imdbId) => {
  if (!imdbId) return [];

  return [
    { 
      server: 'Latino VIP (VidSrc)', 
      url: 'https://vidsrc.me/embed/movie?imdb=' + imdbId 
    },
    { 
      server: 'Estreno Rápido', 
      url: 'https://vidsrc.to/embed/movie/' + imdbId 
    },
    { 
      server: 'Alternativo (SuperEmbed)', 
      url: 'https://multiembed.mov/directstream.php?video_id=' + imdbId + '&tmdb=1' 
    }
  ];
};
