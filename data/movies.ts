import { TMDB_API_KEY, TMDB_API_URL, TMDB_IMAGE_URL } from "../config";

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster: string;
  rating: number;
  year: number;
  genre: string[];
  duration: string;
  director: string;
  imdbID?: string;
}

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

function mapTrendingMovie(item: TMDBTrendingResult): Movie {
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

export const fallbackMovies: Movie[] = [
  {
    id: 1,
    title: "The Shawshank Redemption",
    overview: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    poster: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGE7Yqtex5YFGGq9MZ3.jpg",
    rating: 4.65,
    year: 1994,
    genre: ["Drama"],
    duration: "142 min",
    director: "Frank Darabont",
  },
  {
    id: 2,
    title: "The Godfather",
    overview: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    poster: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    rating: 4.5,
    year: 1972,
    genre: ["Crime", "Drama"],
    duration: "175 min",
    director: "Francis Ford Coppola",
  },
  {
    id: 3,
    title: "The Dark Knight",
    overview: "When the menace known as the Joker wreaks havoc on Gotham, Batman must confront one of the greatest psychological tests.",
    poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911BTUgMe1p9LhF.jpg",
    rating: 4.5,
    year: 2008,
    genre: ["Action", "Crime", "Drama"],
    duration: "152 min",
    director: "Christopher Nolan",
  },
  {
    id: 4,
    title: "Pulp Fiction",
    overview: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.",
    poster: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    rating: 4.4,
    year: 1994,
    genre: ["Crime", "Drama"],
    duration: "154 min",
    director: "Quentin Tarantino",
  },
  {
    id: 5,
    title: "Schindler's List",
    overview: "In German-occupied Poland during World War II, Oskar Schindler gradually becomes concerned for his Jewish workforce.",
    poster: "https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
    rating: 4.45,
    year: 1993,
    genre: ["Biography", "Drama", "History"],
    duration: "195 min",
    director: "Steven Spielberg",
  },
  {
    id: 6,
    title: "The Lord of the Rings: The Return of the King",
    overview: "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom.",
    poster: "https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg",
    rating: 4.45,
    year: 2003,
    genre: ["Action", "Adventure", "Drama"],
    duration: "201 min",
    director: "Peter Jackson",
  },
  {
    id: 7,
    title: "Forrest Gump",
    overview: "The presidencies of Kennedy and Johnson unfold through the perspective of an Alabama man with an IQ of 75.",
    poster: "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
    rating: 4.3,
    year: 1994,
    genre: ["Drama", "Romance"],
    duration: "142 min",
    director: "Robert Zemeckis",
  },
  {
    id: 8,
    title: "Fight Club",
    overview: "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.",
    poster: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    rating: 4.25,
    year: 1999,
    genre: ["Drama"],
    duration: "139 min",
    director: "David Fincher",
  },
  {
    id: 9,
    title: "Inception",
    overview: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.",
    poster: "https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2na6210LUVb.jpg",
    rating: 4.4,
    year: 2010,
    genre: ["Action", "Sci-Fi", "Thriller"],
    duration: "148 min",
    director: "Christopher Nolan",
  },
  {
    id: 10,
    title: "The Matrix",
    overview: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    poster: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9Gkd5EpNWUzpO.jpg",
    rating: 4.35,
    year: 1999,
    genre: ["Action", "Sci-Fi"],
    duration: "136 min",
    director: "The Wachowskis",
  },
];

export async function getTrendingMovies(): Promise<Movie[]> {
  if (!TMDB_API_KEY || TMDB_API_KEY === "YOUR_TMDB_API_KEY") {
    return fallbackMovies;
  }
  
  try {
    const url = `${TMDB_API_URL}/trending/movie/week?api_key=${TMDB_API_KEY}&language=en-US&page=1`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.results && Array.isArray(data.results) && data.results.length > 0) {
      return data.results.slice(0, 10).map(mapTrendingMovie);
    }
    return fallbackMovies;
  } catch {
    return fallbackMovies;
  }
}
