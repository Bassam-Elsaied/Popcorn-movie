import { useState, useEffect } from "react";
import { NavBar, Resault } from "./NavBar";
import Body from "./Body";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import DarkMode from "./DarkMode";
import { Summary, WatchedSummary } from "./SummryBox";
import MovieList from "./MovieList";
import Box from "./Box";
import MovieDetailes from "./MovieDetailes";
import Loader from "./Loader";

const KEY = "23daf0c7";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (selectedId === id ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleWatched(movie) {
    setWatched((watched) => {
      // Check if the movie is already in the watched list
      const isMovieInList = watched.some(
        (watchedMovie) => watchedMovie.imdbID === movie.imdbID
      );

      // If the movie is not in the list, add it; otherwise, return the current list
      return isMovieInList ? watched : [...watched, movie];
    });
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  //  fetch movie data and handle error
  useEffect(() => {
    const controller = new AbortController();

    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError("");

        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal }
        );

        if (!res.ok)
          throw new Error("Something went wrong with fetching movies");

        const data = await res.json();
        if (data.Response === "False") throw new Error("Movie not found");

        setMovies(data.Search);
        setError("");
      } catch (err) {
        if (err.name !== "AbortError") {
          console.log(err.message);
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }

    fetchMovies();

    return function () {
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    if (selectedId) {
      const selectedMovie = movies.find((movie) => movie.imdbID === selectedId);
      document.title = `Movie | ${selectedMovie?.Title || ""}`;
    } else {
      document.title = "usePopcorn";
    }
  }, [selectedId, movies]);

  return (
    <>
      <NavBar>
        <Logo />
        <SearchBar query={query} setQuery={setQuery} />
        <Resault movies={movies} />
        <DarkMode />
      </NavBar>
      <Body>
        <Box>
          {!isLoading && !error && (
            <MovieList movies={movies} handleSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
          {isLoading && <Loader />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetailes
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onWatched={handleWatched}
              watched={watched} // Add this line
            />
          ) : (
            <>
              <Summary watched={watched} />
              <WatchedSummary
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Body>
    </>
  );
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>🚨</span>
      {message}
    </p>
  );
}
