import { TMDB_API_KEY, TMDB_API_URL, TMDB_IMAGE_URL } from "../config";
import { Movie } from "./movies";

const TMDB_GENRE_MAP: { [key: number]: string } = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
  80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
  14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
  9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 10770: "TV Movie",
  53: "Thriller", 10752: "War", 37: "Western",
};

interface TMDBTrendingResult {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
}

interface TMDBMovieDetail {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  runtime: number;
  genres: { id: number; name: string }[];
  credits: { crew: { job: string; name: string }[] };
  imdb_id: string;
}

interface TMDBExternalIds {
  imdb_id: string;
}

function mapTMDBTrending(item: TMDBTrendingResult): Movie {
  return {
    id: item.id,
    title: item.title,
    overview: item.overview || "",
    poster: item.poster_path ? `${TMDB_IMAGE_URL}${item.poster_path}` : "",
    rating: item.vote_average / 2,
    year: parseInt(item.release_date?.split("-")[0] || "0", 10),
    genre: item.genre_ids.slice(0, 3).map((id) => TMDB_GENRE_MAP[id] || "Other"),
    duration: "",
    director: "",
  };
}

export async function getTrendingMovies(): Promise<Movie[]> {
  if (!TMDB_API_KEY || TMDB_API_KEY === "a5c8b9c7e8f1234567890abcdef12345") {
    return [];
  }
  
  try {
    const url = `${TMDB_API_URL}/trending/movie/week?api_key=${TMDB_API_KEY}&language=en-US&page=1`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.results && Array.isArray(data.results)) {
      return data.results.slice(0, 10).map(mapTMDBTrending);
    }
    return [];
  } catch {
    return [];
  }
}

export async function getTMDBMovieDetail(movieId: number): Promise<Movie | null> {
  if (!TMDB_API_KEY || TMDB_API_KEY === "a5c8b9c7e8f1234567890abcdef12345") {
    return null;
  }
  
  try {
    const [detailRes, creditsRes] = await Promise.all([
      fetch(`${TMDB_API_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`),
      fetch(`${TMDB_API_URL}/movie/${movieId}/credits?api_key=${TMDB_API_KEY}&language=en-US`),
    ]);
    
    const detail: TMDBMovieDetail = await detailRes.json();
    const credits = await creditsRes.json();
    
    if (detail.id) {
      const director = credits.crew?.find((c) => c.job === "Director")?.name || "";
      return {
        id: detail.id,
        title: detail.title,
        overview: detail.overview,
        poster: detail.poster_path ? `${TMDB_IMAGE_URL}${detail.poster_path}` : "",
        rating: detail.vote_average / 2,
        year: parseInt(detail.release_date?.split("-")[0] || "0", 10),
        genre: detail.genres?.map((g) => g.name) || [],
        duration: detail.runtime ? `${detail.runtime} min` : "N/A",
        director: director,
        imdbID: detail.imdb_id,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export async function searchMovies(query: string): Promise<Movie[]> {
  if (!TMDB_API_KEY || TMDB_API_KEY === "a5c8b9c7e8f1234567890abcdef12345") {
    return [];
  }
  
  if (!query.trim()) return [];
  
  try {
    const url = `${TMDB_API_URL}/search/movie?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1&include_adult=false`;
    const res = await fetch(url);
    const data = await res.json();
    
    if (data.results && Array.isArray(data.results)) {
      return data.results.slice(0, 10).map((item: TMDBTrendingResult) => ({
        id: item.id,
        title: item.title,
        overview: item.overview || "",
        poster: item.poster_path ? `${TMDB_IMAGE_URL}${item.poster_path}` : "",
        rating: item.vote_average / 2,
        year: parseInt(item.release_date?.split("-")[0] || "0", 10),
        genre: item.genre_ids.slice(0, 3).map((id) => TMDB_GENRE_MAP[id] || "Other"),
        duration: "",
        director: "",
      }));
    }
    return [];
  } catch {
    return [];
  }
}

export async function getMovieDetail(imdbID: string): Promise<Movie | null> {
  if (!TMDB_API_KEY || TMDB_API_KEY === "a5c8b9c7e8f1234567890abcdef12345") {
    return null;
  }
  
  try {
    const searchUrl = `${TMDB_API_URL}/search/movie?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(imdbID)}`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();
    
    if (searchData.results && searchData.results.length > 0) {
      const movieId = searchData.results[0].id;
      return await getTMDBMovieDetail(movieId);
    }
    return null;
  } catch {
    return null;
  }
}
