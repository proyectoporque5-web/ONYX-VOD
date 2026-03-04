import axios from 'axios';

const API_KEY = 'c6b1d606ddd5763bd3764aee5c669476';
const BASE_URL = 'https://api.themoviedb.org/3';

const tmdbClient = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'es-MX',
    include_image_language: 'es,en,null',
  },
});

export const getTrendingMovies = async () => {
  const response = await tmdbClient.get('/trending/movie/week');
  return response.data;
};

export const getTopRatedMovies = async () => {
  const response = await tmdbClient.get('/movie/top_rated');
  return response.data;
};

export const getMovieDetails = async (id) => {
  const response = await tmdbClient.get(`/movie/${id}`, {
    params: {
      append_to_response: 'videos,credits,similar,external_ids,images',
      include_image_language: 'es,en,null',
    },
  });
  return response.data;
};

export const searchMovies = async (query) => {
  const response = await tmdbClient.get('/search/movie', {
    params: {
      query,
      include_adult: false,
      language: 'es-MX',
      page: 1,
    },
  });
  return response.data;
};

export const getGenres = async () => {
  const response = await tmdbClient.get('/genre/movie/list');
  return response.data;
};

export const getActionMovies = async () => {
  const response = await tmdbClient.get('/discover/movie', {
    params: {
      with_genres: 28,
    },
  });
  return response.data;
};

export const getComedyMovies = async () => {
  const response = await tmdbClient.get('/discover/movie', {
    params: {
      with_genres: 35,
    },
  });
  return response.data;
};

export const getHorrorMovies = async () => {
  const response = await tmdbClient.get('/discover/movie', {
    params: {
      with_genres: 27,
    },
  });
  return response.data;
};

export const getSciFiMovies = async () => {
  const response = await tmdbClient.get('/discover/movie', {
    params: {
      with_genres: 878,
    },
  });
  return response.data;
};

export const getDramaMovies = async () => {
  const response = await tmdbClient.get('/discover/movie', {
    params: {
      with_genres: 18,
    },
  });
  return response.data;
};

export const getThrillerMovies = async () => {
  const response = await tmdbClient.get('/discover/movie', {
    params: {
      with_genres: 53,
    },
  });
  return response.data;
};

export const getRomanceMovies = async () => {
  const response = await tmdbClient.get('/discover/movie', {
    params: {
      with_genres: 10749,
    },
  });
  return response.data;
};

export const getFamilyMovies = async () => {
  const response = await tmdbClient.get('/discover/movie', {
    params: {
      with_genres: 10751,
    },
  });
  return response.data;
};

export const getDocumentaries = async () => {
  const response = await tmdbClient.get('/discover/movie', {
    params: {
      with_genres: 99,
    },
  });
  return response.data;
};

export const getAnimationMovies = async () => {
  const response = await tmdbClient.get('/discover/movie', {
    params: {
      with_genres: 16,
    },
  });
  return response.data;
};

export const getLogo = (movie) => {
  if (!movie?.images?.logos) return null;
  const logos = movie.images.logos;
  const spanishLogo = logos.find(logo => logo.iso_639_1 === 'es');
  const englishLogo = logos.find(logo => logo.iso_639_1 === 'en');
  const logo = spanishLogo || englishLogo || logos[0];
  return logo ? logo.file_path : null;
};
