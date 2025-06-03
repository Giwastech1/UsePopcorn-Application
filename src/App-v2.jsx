import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import useMovies from "./useMovies";
const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
const tempQuery = "warrior";
const key = "6ee10de5";
function App() {
  const [query, setQuery] = useState("");
  const [watched, setWatched] = useState(function() {
    const storedValue = localStorage.getItem("watched");
    return storedValue? JSON.parse(storedValue):[];
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
            selectedId ? <MovieDetails selectedId={selectedId} onAddWatched={handleAddWatched} onCloseMovie={handleCloseMovie} setSelectedId={setSelectedId}watched={watched} /> :
              <>
                <WatchedMovieSummary watched={watched} />
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
function Search({ query, setQuery }) {
  const inputEl = useRef(null);
  useEffect(function () {
    function callBack(e) {
      if (e.code === "Enter") {
        inputEl.current.focus();
      }
    }
    document.addEventListener("keydown", callBack);
    return function () {
      document.removeEventListener("keydown", callBack);
    }
  },[])
  return <input
    className="search"
    type="text"
    placeholder="Search movies..."
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    ref={inputEl}
  />
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
function ListBox({children}) {
  const [isOpen1, setIsOpen1] = useState(true);
  return  <div className="box">
  <button
    className="btn-toggle"
    onClick={() => setIsOpen1((open) => !open)}
  >
    {isOpen1 ? "–" : "+"}
  </button>
    {isOpen1 && children}
</div>
}
function WatchedBox({children}) {
  const [isOpen2, setIsOpen2] = useState(true);
  return <div className="box">
  <button
    className="btn-toggle"
    onClick={() => setIsOpen2((open) => !open)}
  >
    {isOpen2 ? "–" : "+"}
  </button>
  {isOpen2 && children}
</div>
}
function Main({children}) {
  
  return <main className="main">
           {children}
         </main>
}

function MoviesList({ movies, onSelectId }) {
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");

  //Filtering logic
  function filteredMovies() {
    return movies.filter((movie) => {
      const matchesGenre = selectedGenre === "All" || movie.Genre?.includes(selectedGenre);
      const matchesYear = selectedYear === "All" || movie.Year === selectedYear;
      return matchesGenre && matchesYear;
    })
  }
  return (
    <>
      {/*Show filters only if there are movies */}
      {movies.length > 0 && (
        <div className="filters">
          <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
            <option value="All">All Genres</option>
            <option value="Action">Action</option>
            <option value="Comedy">Comedy</option>
            <option value="Drama">Drama</option>
            <option value="Horror">Horror</option>
          </select>

          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
            <option value="All">All Years</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
            <option value="2017">2017</option>
            <option value="2015">2015</option>
            <option value="2010">2010</option>
          </select>
        </div>
      )}

      {/* Show filtered movies */}
      <ul className="list list-movies box">
        {filteredMovies().map((movie) => (
          <Movie movie={movie} key={movie.imdbID} onSelectId={onSelectId} />
        ))}
      </ul>
    </>
  );
}


{/*function MoviesList({ movies, onSelectId }) {
  return (
    <ul className="list list-movies box">
      {movies.map((movie) => (
      <Movie movie={movie} key={movie.imdbID} onSelectId={onSelectId} />
      ))}
    </ul>
  )
}
*/}
  function Movie({movie,onSelectId}) {
    return <li onClick={() => onSelectId(movie.imdbID)}>
        <img src={movie.Poster} alt={`Poster${movie.Title}Poster`} />
        <h3>{movie.Title}</h3>
        <div>
          <p>
            <span>🗓</span>
            <span>{movie.Year}</span>
          </p>
        </div>
    </li >  
  }
function MovieDetails({ selectedId, onAddWatched, onCloseMovie,setSelectedId,watched}) {
  const [loading, setLoading] = useState(false);
  const [movie, setMovie] = useState({});
  const [userRating, setUserRating] = useState(0);
  const { Title: title,
    Year: year,
    Poster: poster,
    Rated: rated,
    Released: released,
    Actors: actors,
    Director: directors,
    Genre: genre,
    Runtime: runtime,
    Plot: plot,
    imdbRating: imdbRating,
  } = movie;
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find((movie) => movie.imdbID === selectedId)?.userRating;
  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      imdbRating:Number(imdbRating),
      title,
      year,
      poster,
      runtime: Number(runtime.split(" ").at(0)),
      userRating
    };
    onAddWatched(newWatchedMovie);
    setSelectedId(null);
  }
  useEffect(function () {
    async function getMoviesDetails() {
      setLoading(true);
      const res = await fetch(`https://www.omdbapi.com/?apikey=${[key]}&i=${selectedId}`);
      const data = await res.json();
      setMovie(data);
      setLoading(false);
    }
    getMoviesDetails();
  }, [selectedId]);
  useEffect(function () {
    function callBack(e) {
      if (e.code === "Escape") {
        onCloseMovie();
      }
    }
    document.addEventListener("keydown", callBack);
    return function () {
      document.removeEventListener("keydown", callBack);
    }
  },[])
  useEffect(function () {
    if (!title) {
      return;
    }
    document.title = `Movie | ${title}`;
    return function () {
      document.title = "usePopcorn";
    }
  }, [title]);
  return (
    <div>
      {
        loading ? <Loader /> :
          <>
            <header className="details">
              <button className="btn-back" onClick={onCloseMovie}>&larr;</button>
        <img src={poster} alt={`Poster of ${movie}`} />
        <div className="details-overview">
          <h2>{title}</h2>
          <p>{released} &bull; {runtime}</p>
          <p>{genre}</p>
          <span>⭐{imdbRating} IMDd rating</span>
        </div>
            </header>
            <section>
              {
                isWatched ? <><p className="rating">You rated this movie {watchedUserRating}⭐</p>
                  <p>
                <em>{plot}</em>
             </p>
               <p>Starring {actors}</p>
               <p>Directed by {directors}</p></>:
                <>
                  <div className="rating">
                <StarRating size={20} message={["terrible", "bad", "okay", "good", "amazing"]} maxRating={10} onSetRating={setUserRating} />
                {userRating>0 && <button className="btn-add" onClick={handleAdd}>+ Add to list</button>}
             </div>
           <p>
             <em>{plot}</em>
          </p>
            <p>Starring {actors}</p>
            <p>Directed by {directors}</p>
                </>
              }
        </section>
            
          </>
      }
      </div>  
  ) 
}
function WatchedMovieSummary({ watched }) {
  const validImdbRating = watched.map((movie) => movie.imdbRating).filter((imdbRating) => !isNaN(imdbRating));
  const avgImdbRating = average(validImdbRating);
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const validRuntime = watched.map((movie) => movie.runtime).filter((runtime) => !isNaN(runtime));
  const avgRuntime = average(validRuntime);
  return <div className="summary">
  <h2>Movies you watched</h2>
  <div>
    <p>
      <span>#️⃣</span>
      <span>{watched.length} movies</span>
    </p>
    <p>
      <span>⭐</span>
      <span>{avgImdbRating.toFixed(2)}</span>
    </p>
    <p>
      <span>🌟</span>
      <span>{avgUserRating.toFixed(2)}</span>
    </p>
    <p>
      <span>⏳</span>
      <span>{Math.round(avgRuntime)} min</span>
    </p>
  </div>
</div>
}
function WatchedMovieList({watched,onDeleteMovie}) {
  return  <ul className="list box">
  {watched.map((movie) => (
    <WatchedMovie movie={movie} key={movie.imdbID}onDeleteMovie={onDeleteMovie} />
  ))}
</ul>
}
function WatchedMovie({ movie,onDeleteMovie }) {
  return <li>
  <img src={movie.poster} alt={`${movie.title}poster`} />
  <h3>{movie.title}</h3>
  <div>
    <p>
      <span>⭐</span>
      <span>{movie.imdbRating}</span>
    </p>
    <p>
      <span>🌟</span>
      <span>{movie.userRating}</span>
    </p>
    <p>
      <span>⏳</span>
        <span>{movie.runtime}</span>
      </p>
      <button className="btn-delete" onClick={()=>onDeleteMovie(movie.imdbID)}>X</button>
  </div>
</li>
}

export default App;