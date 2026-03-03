export const resolveMovieStream = async (tmdbId, imdbId) => {
  // TODO: Implement external API fetching using imdbId (e.g., vidsrc.to/embed/movie/{imdbId})
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          server: 'Servidor VIP (Sin Anuncios)',
          url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        },
        {
          server: 'Servidor Rápido',
          url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        },
        {
          server: 'FastStream 4K (Subtitulado)',
          url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        }
      ]);
    }, 2000);
  });
};
