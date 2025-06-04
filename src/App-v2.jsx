import { useEffect, useRef, useState } from "react";
import useMovies from "./useMovies";
import MovieDetails from "./MovieDetails";
import WatchedBox from "./WatchedBox";
import WatchedMovieSummary from "./WatchedMovieSummary";
import Search from "./Search";
import MoviesList from "./MovieList";
import WatchedMovieList from "./WatchedMovieList";
import ListBox from "./ListBox";

const average = (arr) => arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
const key = "6ee10de5";
function App() {
  const [query, setQuery] = useState("");
  const [watched, setWatched] = useState(function () {
    const storedValue = localStorage.getItem("watched");
    return storedValue ? JSON.parse(storedValue) : [];
  })
  const [selectedId, setSelectedId] = useState(null);
  const { movies, isLoading, error } = useMovies(query,key,handleCloseMovie);
  function handleDeleteMovie(id) {
    setWatched((movies) => movies.filter((movie) => movie.imdbID !== id));
  }
  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }
  function handleCloseMovie() {
    setSelectedId(null);
  }
  function handleSelectId(id) {
    setSelectedId(id !== selectedId ? id : null);
  }
  useEffect(function () {
    localStorage.setItem("watched", JSON.stringify(watched));
  }, [watched]);
  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumOfResult movies={movies} />
      </NavBar>
      <Main>
        <ListBox>
          {!isLoading && !error && <MoviesList movies={movies} onSelectId={handleSelectId} />}
          {error && <ErrorComponet message={error} />}
          {isLoading && !error && <Loader/>}
        </ListBox>
        <WatchedBox>
          {
            selectedId ? <MovieDetails selectedId={selectedId} onAddWatched={handleAddWatched} onCloseMovie={handleCloseMovie} setSelectedId={setSelectedId}watched={watched} key={key} /> :
              <>
                <WatchedMovieSummary watched={watched} average={average} />
                <WatchedMovieList watched={watched} onDeleteMovie={handleDeleteMovie} />
              </>
          }
        </WatchedBox>
      </Main>
    </>
  );
}
function ErrorComponet({ message }) {
  return (
    <p className="error">
      <span>⛔</span>{message}
    </p>
  )
}
function Loader() {
  return <h1>Loading...</h1>
}
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
function NumOfResult({movies}) {
  return <p className="num-results">
    Found <strong>{movies.length}</strong> results
</p>
}
function NavBar({children}) {
  return <nav className="nav-bar">
    {children}
</nav>
}
function Main({children}) {
  
  return <main className="main">
           {children}
         </main>
}
export default App;