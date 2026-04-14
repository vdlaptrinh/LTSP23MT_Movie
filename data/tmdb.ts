import { Movie } from "./movies";
import { API_KEY, API_URL } from "../config";

interface OMDBSearchResult {
  Title: string;
  Year: string;
  imdbID: string;
  Poster: string;
  Type: string;
}

interface OMDBDetail {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Actors: string;
  Plot: string;
  imdbRating: string;
  Poster: string;
  imdbID: string;
  Response: string;
}

function mapSearchResult(item: OMDBSearchResult): Movie {
  return {
    id: parseInt(item.imdbID.replace(/\D/g, ""), 10) || Math.random() * 100000 | 0,
    title: item.Title,
    overview: "",
    poster: item.Poster !== "N/A" ? item.Poster : "",
    rating: 0,
    year: parseInt(item.Year, 10) || 0,
    genre: [],
    duration: "",
    director: "",
    imdbID: item.imdbID,
  };
}

function mapDetail(item: OMDBDetail): Movie {
  return {
    id: parseInt(item.imdbID.replace(/\D/g, ""), 10) || Math.random() * 100000 | 0,
    title: item.Title,
    overview: item.Plot !== "N/A" ? item.Plot : "",
    poster: item.Poster !== "N/A" ? item.Poster : "",
    rating: parseFloat(item.imdbRating) || 0,
    year: parseInt(item.Year, 10) || 0,
    genre: item.Genre !== "N/A" ? item.Genre.split(", ").map((g) => g.trim()) : [],
    duration: item.Runtime !== "N/A" ? item.Runtime : "N/A",
    director: item.Director !== "N/A" ? item.Director : "",
    imdbID: item.imdbID,
  };
}

export async function searchMovies(query: string): Promise<Movie[]> {
  if (!query.trim()) return [];
  const url = `${API_URL}/?apikey=${API_KEY}&s=${encodeURIComponent(query)}&type=movie`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.Response === "False") return [];
  const results = (data.Search || []).map(mapSearchResult);
  const seen = new Set<string>();
  return results.filter((m: Movie) => {
    if (seen.has(m.imdbID || "")) return false;
    seen.add(m.imdbID || "");
    return true;
  });
}

export async function getMovieDetail(imdbID: string): Promise<Movie | null> {
  const url = `${API_URL}/?apikey=${API_KEY}&i=${encodeURIComponent(imdbID)}&plot=full`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.Response === "False") return null;
  return mapDetail(data);
}