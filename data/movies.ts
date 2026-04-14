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

const movies: Movie[] = [
  {
    id: 1,
    title: "Inception",
    overview:
      "Dom Cobb is a skilled thief, the absolute best in the art of extraction — stealing valuable secrets from deep within the subconscious during the dream state.",
    poster: "https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2na6210LUVb.jpg",
    rating: 8.8,
    year: 2010,
    genre: ["Action", "Sci-Fi", "Thriller"],
    duration: "148 min",
    director: "Christopher Nolan",
  },
  {
    id: 2,
    title: "The Dark Knight",
    overview:
      "When the menace known as the Joker wreaks havoc on Gotham, Batman must confront one of the greatest psychological tests of his ability to fight injustice.",
    poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911BTUgMe1p9LhF.jpg",
    rating: 9.0,
    year: 2008,
    genre: ["Action", "Crime", "Drama"],
    duration: "152 min",
    director: "Christopher Nolan",
  },
  {
    id: 3,
    title: "Interstellar",
    overview:
      "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival as Earth becomes uninhabitable.",
    poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    rating: 8.6,
    year: 2014,
    genre: ["Adventure", "Drama", "Sci-Fi"],
    duration: "169 min",
    director: "Christopher Nolan",
  },
  {
    id: 4,
    title: "Parasite",
    overview:
      "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    poster: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1Tfym2fg5U7aw8.jpg",
    rating: 8.5,
    year: 2019,
    genre: ["Comedy", "Drama", "Thriller"],
    duration: "132 min",
    director: "Bong Joon-ho",
  },
  {
    id: 5,
    title: "The Shawshank Redemption",
    overview:
      "Over the course of several years, two convicts form a friendship, seeking consolation and eventual redemption through basic compassion.",
    poster: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGE7Yqtex5YFGGq9MZ3.jpg",
    rating: 9.3,
    year: 1994,
    genre: ["Drama"],
    duration: "142 min",
    director: "Frank Darabont",
  },
  {
    id: 6,
    title: "Spirited Away",
    overview:
      "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits.",
    poster: "https://image.tmdb.org/t/p/w500/39wmItV4d3XT3VhEVjCRXwPnE5I.jpg",
    rating: 8.8,
    year: 2001,
    genre: ["Animation", "Adventure", "Fantasy"],
    duration: "125 min",
    director: "Hayao Miyazaki",
  },
  {
    id: 7,
    title: "The Matrix",
    overview:
      "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth — the life he knows is the elaborate deception of an evil cyber-intelligence.",
    poster: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9Gkd5EpNWUzpO.jpg",
    rating: 8.7,
    year: 1999,
    genre: ["Action", "Sci-Fi"],
    duration: "136 min",
    director: "The Wachowskis",
  },
  {
    id: 8,
    title: "Avengers: Endgame",
    overview:
      "After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more to reverse Thanos' actions.",
    poster: "https://image.tmdb.org/t/p/w500/or06FC3JvEBp4K6R3AMO2W3VOPJ.jpg",
    rating: 8.4,
    year: 2019,
    genre: ["Action", "Adventure", "Sci-Fi"],
    duration: "181 min",
    director: "Anthony Russo, Joe Russo",
  },
  {
    id: 9,
    title: "Whiplash",
    overview:
      "A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student's potential.",
    poster: "https://image.tmdb.org/t/p/w500/7fn624j549cl925Q3Yp24hlCp1e.jpg",
    rating: 8.5,
    year: 2014,
    genre: ["Drama", "Music"],
    duration: "106 min",
    director: "Damien Chazelle",
  },
  {
    id: 10,
    title: "Your Name",
    overview:
      "High schoolers Mitsuha and Taki are complete strangers living separate lives. But when Mitsuha makes a wish to be a handsome Tokyo boy, their paths cross in an unexpected way.",
    poster: "https://image.tmdb.org/t/p/w500/xq4Q9XB6B0wqC0hN7VGrJ1DFnMh.jpg",
    rating: 8.9,
    year: 2016,
    genre: ["Animation", "Drama", "Romance"],
    duration: "106 min",
    director: "Makoto Shinkai",
  },
];

export default movies;